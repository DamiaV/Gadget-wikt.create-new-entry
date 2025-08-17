# Gadget “wikt.create-new-entry”

The gadget to create new entries on [fr.wiktionary.org](https://fr.wiktionary.org). The gadget’s sources on the wiki can be found [here](https://fr.wiktionary.org/wiki/Spécial:Index/MediaWiki:Gadget-wikt.create-new-entry).

# Setting up the workspace

To setup the workspace, you need to run the following command in the root directory:

```
./init_workspace.sh <wiki username> <bot password>
```
It will perform the following actions:
1. Create the `user-config.py` and `user-password.py` files for Pywikibot using the provided credentials.
1. Create a Python venv.
1. Install all Python packages from `requirements.txt`.
1. Download all wiki dependencies.
1. Install all NPM dependencies.

⚠️ **Important**: If you want to push changes to the wiki, you need an account that has the interface administrator status.

You can create a bot password by going to [Special:BotPasswords](https://fr.wiktionary.org/wiki/Special:BotPasswords) while logged into the account you want to use.

If you are using VSCode, it is strongly advised you install all recommended extensions from `.vscode/extensions.json`.

JS/Vue files are linted and formatted with ESLint and Prettier. Python files are linted with Pylint and formatted with Black. Please run these before pushing your changes.

# Project structure

The project’s structure is as follows (only relevant files and directories are listed):
* `build_scripts`: Packages for `sync.py`.
* `public`: Contains public assets for local testing. You shouldn’t need to modify its contents.
    * `codex.style.css`: Codex CSS styles. It is copied from `node_modules/@wikimedia/codex/dist/`.
    * `style.css`: Additionnal styles.
* `src`: The root directory for the gadget’s sources.
    * `components`: Contains all Vue components used by the gadget.
    * `wiki_deps`: Contains all dependencies from the wiki. See section “Download wiki dependencies” for more details. You should not edit its contents manually. This directory is excluded from git.
    * `App.vue`: The root component of the gadget.
    * `main.js`: The gadget’s main file on the wiki.
    * `main-dev.js`: The gadget’s main file for local testing.
* `config.json`: Contains the configuration for `sync.py`.
* `index.html`: The index file for local testing.
* `sync.py`: The CLI tool for syncing local files with the wiki.  See section “Syncing with the wiki” for more details on how to use it.

# Local testing

To test the gadget locally, run `npm run dev` then go to the address shown in the terminal.

# Syncing with the wiki

Files sync is performed through the `sync.py` tool. In order to know which files/pages should be updated, it refers to the local file structure in the `src` directory.

Each of the sub-commands below have a `-v`/`--verbose` option.

Run `python3 sync.py -h` for help.

## Commands
⚠️ **Important**: The following commands do not interact with git. To push and pull changes to and from the GitHub repository, use the `git` command.

### Pull remote changes (`pull`)

To pull remote changes, run `python3 sync.py pull`. It will update all local source files in the `src` directory with the versions from the wiki. Once done, `eslint --fix` will be run on the `src` directory with `npm run lint:fix`. If a local file does not have a remote wiki page, the local file will be left unchanged.

Actions performed on `.js` and `.vue` files:
* Transform all `const … = require("…");` into `import … from "…";`.
* Transform all `module.exports = …;` into `export default …;`.
* Replace all imports of `icons.json` by `@wikimedia/codex-icons`.
* Prefix all imports of core modules (`wikt.core.*.js`) with `wiki_deps/` and the appropriate amount of `../` or `./`.

### Push local changes (`push`)

To push local changes to the wiki, run `python3 sync.py push -m "<edit message>"`. It will update all pages on the wiki with the version from local source files. The gadget’s version will also be patched in `src/App.vue` from `config.json`. If a local file does not have a remote wiki page, it will be created.

Files not tracked by git are ignored.

Once all files have been pushed on the wiki, the [gadget’s definition](https://fr.wiktionary.org/wiki/MediaWiki:Gadgets-definition) is updated if necessary. This definition includes all source files that were pushed, all wiki dependencies listed in `config.json`. Codex icon names are extracted from all `.js` and `.vue` files by detecting any import from `@wikimedia/codex-icons`.

Actions performed on `.js` and `.vue` files:
* Transform all `import … from "…";` into `const … = require("…");`.
* Transform all `export default …;` into `module.exports = …;`.
* Replace all imports of `@wikimedia/codex-icons` by `icons.json` and the appropriate amount of `../` or `./`.
* Remove all`wiki_deps/` prefixes on imports of core modules (`wikt.core.*.js`).

### Download wiki dependencies (`updatewikideps`)

The gadget imports dependencies that are only available on the wiki. In order to be able to run the gadget locally, and for linters to work properly, you need to download these dependencies in your workspace.

To do so, run `python3 sync.py updatewikideps`. It will download the dependencies into the `src/wiki_deps` directory. These are listed in `config.json` under `wikiDependencies`. The contents of these files should not be updated manually.

The same actions are performed on the downloaded `.js` files as the `pull` command.

## Changing Pywikibot credentials

If you want to change your Pywikibot credentials, edit `user-config.py` and `user-password.py` with your new username and bot token.

**Reminder: you need to use an account that has the interface administrator status if you want to push changes to the wiki.**

You can create a bot password by going to [Special:BotPasswords](https://fr.wiktionary.org/wiki/Special:BotPasswords) while logged into the account you want to use.

## `config.py`

This file contains the configuration for `sync.py`. Its structure is as follows:
* `gadgetName`: The gadget’s name on the wiki. It comes from the title of the gadget’s description page, [MediaWiki:Gadget-*wikt.create-new-entry*](https://fr.wiktionary.org/wiki/MediaWiki:Gadget-wikt.create-new-entry), which is also the prefix of all the gadget’s source pages.
* `gadgetDependencies`: The list of runtime npm dependencies. These are used to set the `dependencies=` option of the gadget’s definition in [MediaWiki:Gadgets-definition](https://fr.wiktionary.org/wiki/MediaWiki:Gadgets-definition).
* `wikiDependencies`: The list of runtime wiki dependencies, in alphabetical order (tho it does not really matter). These are necessary to run the gadget locally, and are downloaded when running the `updatewikideps` command.
* `ignoredFiles`: A list of files from the `src/` directory to ignore when running the `push` command.