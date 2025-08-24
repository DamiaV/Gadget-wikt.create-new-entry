import dataclasses
import json
import os
import pathlib

from . import vcs


SRC_DIR = pathlib.Path("src")
WIKI_DEPS_DIR = SRC_DIR / "wiki_deps"
TESTS_DIR = SRC_DIR / "tests"


@dataclasses.dataclass(frozen=True)
class Config:
    """This class represents the local config.json file."""

    gadget_name: str
    page_prefix: str
    gadget_deps: list[str]
    wiki_deps: list[str]
    ignored_files: set[pathlib.Path]


@dataclasses.dataclass(frozen=True)
class File:
    """This class links a local source file to its remote wiki page."""

    local_path: pathlib.Path
    src_path: pathlib.Path
    remote_title: str
    is_tracked: bool
    is_modified: bool


def load_config() -> Config:
    """
    Load the current config from "config.json".

    :return: A Config object.
    """
    with open("config.json", encoding="UTF-8") as f:
        settings = json.load(f)
    gadget_name = settings["gadgetName"]
    return Config(
        gadget_name=gadget_name,
        page_prefix=f"MediaWiki:Gadget-{gadget_name}/",
        gadget_deps=settings["gadgetDependencies"],
        wiki_deps=settings["wikiDependencies"],
        ignored_files={SRC_DIR / file for file in settings.get("ignoredFiles", [])},
    )


def extract_local_file_structure(config: Config) -> set[File]:
    """
    Extract the local sources’ structure.

    :param config: The current config.
    :return: A set containing File objects representing the local source files.
    """
    files: set[File] = set()
    allowed_exts = (".js", ".vue", ".json")

    for path in SRC_DIR.rglob("*"):
        if (
            path.is_file()
            and os.path.splitext(path.name)[1] in allowed_exts
            and path not in config.ignored_files
            and not str(path).startswith(str(WIKI_DEPS_DIR))
            and not str(path).startswith(str(TESTS_DIR))
        ):
            relative_path = path.relative_to(SRC_DIR)
            files.add(
                File(
                    local_path=path,
                    src_path=relative_path,
                    remote_title=config.page_prefix + str(relative_path),
                    is_tracked=vcs.is_file_tracked(path),
                    is_modified=vcs.is_file_modified(path),
                )
            )

    return sorted(files, key=lambda file: str(file).lower())
