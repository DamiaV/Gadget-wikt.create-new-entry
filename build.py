"""
This build script copies all files from src/ to generated/ and transforms CommonJS
require/module.exports syntax to ESM import from/export default syntax. in all .js and .vue files.
"""

import re
import os.path
import pathlib

import shutil


def commonjs_to_esm(js_file: pathlib.Path) -> str:
    """
    Transform a .js/.vue file from CommonJS to ESM.

    :param js_file: The file to transform.
    :return: The transformed content.
    """
    with js_file.open() as f:
        js = f.read()
    js = re.sub(r"const (.+?) = require\((.+?)\);", r"import \1 from \2;", js)
    js = js.replace("module.exports =", "export default")
    return js


def main() -> None:
    output_dir = pathlib.Path("generated")
    output_dir.mkdir(exist_ok=True)

    for path in pathlib.Path("src").rglob("*"):
        target_path = output_dir / pathlib.Path(*path.parts[1:])
        print(path, "->", target_path)
        if path.is_dir():
            target_path.mkdir(exist_ok=True)
        elif os.path.splitext(path.name)[1] in (".js", ".vue"):
            transformed = commonjs_to_esm(path)
            with target_path.open(mode="w") as f:
                f.write(transformed)
        else:
            shutil.copy(path, target_path)


if __name__ == "__main__":
    main()
