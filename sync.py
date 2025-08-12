"""
This build script copies all files from src/ to generated/ and transforms CommonJS
require/module.exports syntax to ESM import from/export default syntax. in all .js and .vue files.
"""

import argparse
import re
import subprocess
import sys
import typing

import pywikibot as pwb
import pywikibot.exceptions as pwb_ex

from build_scripts import workspace as w


def generate_gadget_definition(
    config: w.Config, files: set[w.File], codex_icons: set[str]
) -> str:
    """
    Generate the definition for the gadget.

    :param config: The current config.
    :param files: The gadget’s source files.
    :param codex_icons: The set of Codex icons used by the gadget.
    :return: The gadget definition string.
    """
    prefix = config.gadget_name
    deps = ", ".join(config.dependencies)
    icons = ", ".join(sorted(codex_icons, key=str.lower))
    sources = " | ".join(
        sorted(
            (f"{prefix}/{file.src_path}" for file in files),
            key=lambda p: " " if "main" in p else p.lower(),
        )
    )
    return (
        f"{prefix} [ResourceLoader | package | dependencies = {deps} | codexIcons = {icons}]"
        f" | {sources}"
    )


def extract_codex_icon_names(js_code: str) -> set[str]:
    """
    Extract the Codex icons imported in the given JS code.

    :param js_code: The JS code to extract icons from.
    :return: The set of imported icons.
    """
    if match := re.search(
        r'import { (\w+(?:, \w+)*) } from "(?:\.\./)+icons\.json";',
        js_code,
        flags=re.MULTILINE,
    ):
        return set(match[1].split(", "))
    return set()


def commonjs_to_esm(commonjs_code: str) -> str:
    """
    Transform a CommonJS module to ESM.

    :param commonjs_code: The CommonJS source code to transform.
    :return: The transformed ESM source code.
    """
    esm_code = re.sub(
        r"const (.+?) = require\((.+?)\);", r"import \1 from \2;", commonjs_code
    )
    esm_code = esm_code.replace("module.exports =", "export default")
    return esm_code


def esm_to_commonjs(esm_code: str) -> str:
    """
    Transform an ESM module to CommonJS.

    :param esm_code: The ESM source code to transform.
    :return: The transformed CommonJS source code.
    """
    commonjs_code = re.sub(
        r"import (.+?) from (.+?);", r"const \1 = require(\2);", esm_code
    )
    commonjs_code = commonjs_code.replace("export default", "module.exports =")
    return commonjs_code


def pull(verbose: bool = False, overwrite: bool = False) -> int:
    """
    Pull changes from the remote wiki.

    :param verbose: If True, show more detailed logs.
    :param overwrite: If True, overwrite any uncommitted changes.
    """
    config = w.load_config()
    files = w.extract_local_file_structure(config)

    site = pwb.Site()
    print("Pulling changes from remote wiki…")
    for file in files:
        if verbose:
            print(f"{file.remote_title} -> {file.local_path}")
        page = pwb.Page(site, file.remote_title)

        if not page.exists():
            if verbose:
                print("Page does not exist, skipping.")
            continue

        if not file.is_tracked and not overwrite:
            print(
                f"Local file '{file.local_path}' is not tracked but page "
                f"[[{file.remote_title}]] exists on the remote wiki, skipping."
            )
            continue

        if file.is_modified and not overwrite:
            print(f"Local file '{file.local_path}' has uncommitted changes, skipping.")
            continue

        text = commonjs_to_esm(page.text)
        with file.local_path.open("w") as f:
            f.write(text)
    print("Done.")

    print("Running 'eslint --fix'…")
    # pylint: disable=subprocess-run-check
    result = subprocess.run(["npm", "run", "lint:fix"])
    print("Done.")
    return result.returncode


UPDATED = 1
NO_CHANGES = 2
ERROR = 3


def update_wiki_page(
    page: pwb.Page, new_text: str, summary: str, verbose: bool = False
) -> int:
    """
    Update the contents of the given wiki page.

    :param page: The wiki page to update.
    :param new_text: The new content.
    :param summary: The edit summary.
    :param verbose: If True, show more detailed logs.
    :return: One of the following status codes: UPDATED, NO_CHANGES, ERROR.
    """
    old_text = page.text
    page.text = new_text
    if old_text.strip() == page.text.strip():
        if verbose:
            print("No changes, skipping.")
        return NO_CHANGES

    try:
        page.save(summary=summary, quiet=True)
    except pwb_ex.PageRelatedError as e:
        print(f"The page {page.title(as_link=True)} could not be saved:", e)
        return ERROR

    if verbose:
        print("Done.")
    return UPDATED


def push(verbose: bool = False, force: bool = False, message: str = None) -> int:
    """
    Push local changes to the remote wiki.

    :param verbose: If True, show more detailed logs.
    :param force: If True, untracked files will be pushed.
    :param message: The edit message.
    """
    config = w.load_config()
    files = w.extract_local_file_structure(config)
    exit_code = 0

    codex_icons = set()
    site = pwb.Site()
    print("Pushing changes with message:", message)
    for file in files:
        if verbose:
            print(f"{file.local_path} -> {file.remote_title}")

        if not file.is_tracked and not force:
            print(f"Warning: Local file '{file.local_path}' is not tracked, skipping.")
            continue

        with file.local_path.open("r") as f:
            js_code = f.read()
            codex_icons |= extract_codex_icon_names(js_code)

        new_text = esm_to_commonjs(js_code)
        page = pwb.Page(site, file.remote_title)
        status = update_wiki_page(page, new_text, message, verbose)
        if status == ERROR:
            exit_code = 1

    print("Updating gadget definition…")
    gadget_definition = generate_gadget_definition(config, files, codex_icons)
    gadget_defs = pwb.Page(site, "MediaWiki:Gadgets-definition")
    new_text = re.sub(
        rf"^\*\s*{config.gadget_name}\s*\[.+?$",
        "* " + gadget_definition,
        gadget_defs.text,
        flags=re.MULTILINE,
    )
    status = update_wiki_page(
        gadget_defs,
        new_text,
        f"Mise à jour automatique de la définition de [[{config.page_prefix[:-1]}]]",
        verbose,
    )
    if status == ERROR:
        exit_code = 2

    return exit_code


ACTIONS: dict[str, typing.Callable[[None], int]] = {
    "pull": pull,
    "push": push,
}


def main() -> None:
    """Main entry point."""
    pwb.config.put_throttle = 0

    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(help="Commands", dest="command")

    pull_parser = subparsers.add_parser(
        "pull", help="Pull changes from the remote wiki."
    )
    pull_parser.add_argument(
        "-o",
        "--overwrite",
        action="store_true",
        help="Overwrite any uncommitted local changes.",
    )
    pull_parser.add_argument(
        "-v", "--verbose", action="store_true", help="Show more detailed logs."
    )

    push_parser = subparsers.add_parser(
        "push", help="Push local changes to the remote wiki."
    )
    push_parser.add_argument(
        "-m", "--message", metavar="MESSAGE", action="store", help="The edit message."
    )
    push_parser.add_argument(
        "-v", "--verbose", action="store_true", help="Show more detailed logs."
    )

    args = parser.parse_args()
    verbose: bool = args.verbose
    kwargs = {
        "verbose": verbose,
    }
    if "message" in args:
        kwargs["message"] = args.message
    if "overwrite" in args:
        kwargs["overwrite"] = args.overwrite

    exit_code = ACTIONS[args.command](**kwargs)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
