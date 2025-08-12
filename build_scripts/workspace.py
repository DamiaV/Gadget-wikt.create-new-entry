import dataclasses
import json
import os
import pathlib

from . import vcs


@dataclasses.dataclass(frozen=True)
class Config:
    """This class represents the local config.json file."""

    gadget_name: str
    page_prefix: str
    ignored_files: set[pathlib.Path]
    dependencies: list[str]


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
        dependencies=settings["dependencies"],
        ignored_files={
            pathlib.Path("src", file) for file in settings.get("ignoredFiles", [])
        },
    )


def extract_local_file_structure(config: Config) -> set[File]:
    """
    Extract the local sources’ structure.

    :param config: The current config.
    :return: A set containing File objects representing the local source files.
    """
    files = set()
    allowed_exts = (".js", ".vue", ".json")

    for path in pathlib.Path("src").rglob("*"):
        if (
            path.is_file()
            and os.path.splitext(path.name)[1] in allowed_exts
            and not path in config.ignored_files
        ):
            relative_path = path.relative_to("src")
            files.add(
                File(
                    local_path=path,
                    src_path=relative_path,
                    remote_title=config.page_prefix + str(relative_path),
                    is_tracked=vcs.is_file_tracked(path),
                    is_modified=vcs.is_file_modified(path),
                )
            )

    return files
