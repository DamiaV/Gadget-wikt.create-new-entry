# Gadget “wikt.create-new-entry”

The gadget to create new entries on [fr.wiktionary.org](https://fr.wiktionary.org). The gadget’s sources on the wiki can be found [here](https://fr.wiktionary.org/wiki/Spécial:Index/MediaWiki:Gadget-wikt.create-new-entry).

## Local testing

To test the gadget locally, run `npm run dev` then go to the address show in the terminal.

## Syncing with the wiki

Files sync is performed through the `sync.py` tool. In order to know which files/pages should be updated, it refers to the local file structure in the `src` directory.

Each of the commands below have a `-v`/`--verbose` option.

⚠️ **Important**: The following commands do not interact with git. To push and pull changes to and from the GitHub repository, use the `git` command.

### Pull remote changes

To pull remote changes, run `python3 sync.py pull`.
It will update all local source files in the `src` directory with the versions from the wiki. Once done, `eslint --fix` will be run on the `src` directory with `npm run lint:fix`. If a local file does not have a remote wiki page, the local file will be left unchanged.

### Push local changes

To push local changes to the wiki, run `python3 sync.py push -m "<edit message>"`. It will update all pages on the wiki with the version from local source files. The gadget’s version will also be patched in `src/App.vue` from `config.json`. If a local file does not have a remote wiki page, it will be created.
