"""
This build script copies all files from src/ to generated/ and transforms CommonJS
require/module.exports syntax to ESM import from/export default syntax. in all .js and .vue files.
"""

import argparse
import dataclasses
import json
import pathlib
import re
import subprocess

import pywikibot as pwb


@dataclasses.dataclass(frozen=True)
class Config:
    """This class represents the current local config."""

    page_prefix: str


@dataclasses.dataclass(frozen=True)
class File:
    """This class links a local source file to its remote wiki page."""

    local_path: pathlib.Path
    remote_title: str


def load_config() -> Config:
    """
    Load the current config from "config.json".

    :return: A Config object.
    """
    with open("config.json", encoding="UTF-8") as f:
        settings = json.load(f)
    return Config(page_prefix=settings["pagePrefix"])


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


def extract_local_file_structure(config: Config) -> set[File]:
    """
    Extract the local sources’ structure.

    :param config: The current config.
    :return: A set containing File objects representing the local source files.
    """
    files = set()

    for path in pathlib.Path("src").rglob("*"):
        if path.is_file():
            files.add(
                File(
                    local_path=path,
                    remote_title=config.page_prefix + "/".join(path.parts[1:]),
                )
            )

    return files


def pull(verbose: bool = False) -> None:
    """
    Pull changes from the remote wiki.

    :param verbose: If True, show more detailed logs.
    """
    config = load_config()
    files = extract_local_file_structure(config)

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
        text = commonjs_to_esm(page.text)
        with file.local_path.open("w") as f:
            f.write(text)
    print("Done.")
    print("Running 'eslint --fix'…")
    # pylint: disable=subprocess-run-check
    subprocess.run(["npm", "run", "lint:fix"])
    print("Done.")


def push(verbose: bool = False, message: str = None) -> None:
    """
    Push local changes to the remote wiki.

    :param verbose: If True, show more detailed logs.
    :param message: The edit message.
    """
    config = load_config()
    files = extract_local_file_structure(config)

    site = pwb.Site()
    print("Pushing changes with message:", message)
    for file in files:
        if verbose:
            print(f"{file.local_path} -> {file.remote_title}")
        page = pwb.Page(site, file.remote_title)
        with file.local_path.open("r") as f:
            page.text = esm_to_commonjs(f.read())
        page.save(summary=message, quiet=True)
    print("Done.")


ACTIONS = {
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

    ACTIONS[args.command](**kwargs)


if __name__ == "__main__":
    main()
