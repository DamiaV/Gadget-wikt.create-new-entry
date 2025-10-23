// <nowiki>
import languages from "./wiki_deps/wikt.core.languages.js";

const sectionRegexp = /==\s*{{langue\s*\|([^|{}]+?)}}\s*==/;

/**
 * Insert the given wikitext into the editor’s box.
 * @param {string} wikitext The wikitext to insert.
 * @param {string} langCode The code of the selected language. Used to know where to insert the code.
 * @throws If the given language code is invalid.
 */
function insertWikitext(wikitext, langCode) {
  const languageName = languages.getLanguageName(langCode);
  if (!languageName) throw new Error(`Invalid language code: ${langCode}`);

  const text = getText() || "";

  if (text.trim() === "") {
    setText(wikitext);
    return;
  }

  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = sectionRegexp.exec(line);
    if (!match) continue;
    const sectionLangName = languages.getLanguageName(match[1].trim(), true);
    if (!sectionLangName || compareNames(languageName, sectionLangName) > 0)
      continue;
    lines.splice(i - 1, 0, wikitext.trim().split("\n"));
    break;
  }

  setText(lines.join("\n"));
}

const conv = languages.getLanguageName("conv");
const french = languages.getLanguageName("fr");

/**
 * Compare two language names.
 * @param {string} name1 A language name.
 * @param {string} name2 Another language name.
 * @returns A positive value if name1 is after name2, a negative value if name1 is before name2, 0 if both names are equal.
 */
function compareNames(name1, name2) {
  if (name1 === name2) return 0;
  if (name1 === conv) return -1;
  if (name2 === conv) return 1;
  if (name1 === french) return -1;
  if (name2 === french) return 1;
  return name1.localeCompare(name2);
}

/**
 * Extract the codes of all language sections from the editor’s box.
 * The extracted codes are guaranteed to not be aliases.
 * @returns An array containing all extracted language codes.
 */
function extractLanguageCodes() {
  const codes = [];
  const text = getText();
  if (!text) return [];

  for (const line of text.split("\n")) {
    const match = sectionRegexp.exec(line);
    if (!match) continue;
    const code = match[1].trim();
    const language = languages.getLanguage(code, true);
    if (!language) continue;
    // Resolve alias if necessary
    codes.push(language.aliasOf || code);
  }

  return codes;
}

function getText() {
  const codeMirror = getCodeMirrorEditor();
  if (codeMirror) return codeMirror.getValue();
  const editor = getDefaultEditor();
  return editor && editor.value;
}

function setText(text) {
  const codeMirror = getCodeMirrorEditor();
  const editor = getDefaultEditor();
  if (codeMirror) codeMirror.setValue(text);
  else if (editor) editor.value = text;
}

/**
 * @type {HTMLTextAreaElement | null}
 */
let defaultEditor = null;

function getDefaultEditor() {
  if (!defaultEditor) defaultEditor = document.getElementById("wpTextbox1");
  return defaultEditor;
}

/**
 * @type {import("@types/codemirror").Editor | null}
 */
let codeMirrorEditor = null;

function getCodeMirrorEditor() {
  if (!codeMirrorEditor) {
    const codeMirrorElement = document.querySelector(".CodeMirror");
    codeMirrorEditor = codeMirrorElement && codeMirrorEditor.CodeMirror;
  }
  return codeMirrorEditor;
}

// </nowiki>
/**
 * This module exports function to interact with the wikitext editor.
 * It is compatible with CodeMirror.
 */
export default {
  insertWikitext,
  extractLanguageCodes,
};
