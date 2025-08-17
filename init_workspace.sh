#! /usr/bin/bash
username="$1"
token="$2"

if [[ ! "$username" || ! "$token" ]]; then
    echo "Usage: $0 WIKI_USERNAME BOT_PASSWORD"
    exit 127
fi

echo "Setting up Python environment…"

echo "# pylint: skip-file
family = \"wiktionary\"
mylang = \"fr\"
usernames[family][mylang] = \"$username\"
password_file = \"user-password.py\"
" > user-config.py

echo "# pylint: skip-file
(\"$username\", \"$token\")
" > user-password.py

python3 -m venv .venv
if [[ $? -ne 0 ]]; then
    echo "Failed to create venv, exiting."
    exit 1
fi
pip install -r requirements.txt
if [[ $? -ne 0 ]]; then
    echo "Failed to install Python requirements, exiting."
    exit 2
fi
python3 sync.py updatewikideps
if [[ $? -ne 0 ]]
    echo "Failed to download wiki dependencies, exiting."
    exit 3
fi

echo "Installing NPM dependencies…"

npm install
if [[ $? -ne 0 ]]; then
    echo "Failed to download npm dependencies, exiting."
    exit 4
fi

echo "Done."
