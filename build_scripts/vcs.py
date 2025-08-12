import pathlib
import subprocess


def is_file_tracked(path: pathlib.Path) -> bool:
    """
    Check whether the given file is tracked by git.

    :param path: The file to check.
    :return: True if the file is tracked, False otherwise.
    """
    # pylint: disable=subprocess-run-check
    result = subprocess.run(["git", "ls-files", "--error-unmatch", str(path)])
    return result.returncode == 0


def is_file_modified(path: pathlib.Path) -> bool:
    """
    Check whether the given file has been modified compared to the current git head.

    :param path: The file to check.
    :return: True if the file has been modified, False otherwise.
    """
    # pylint: disable=subprocess-run-check
    result = subprocess.run(["git", "diff", "--exit-code", str(path)])
    return result.returncode != 0
