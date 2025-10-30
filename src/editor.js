// <nowiki>
import languages from "./wiki_deps/wikt.core.languages.js";

const sectionRegexp = /==\s*{{langue\s*\|([^|{}]+?)}}\s*==/;

/**
 * Insert the given wikitext into the editor’s box.
 * @param {string} wikitext The wikitext to insert.
 * @param {string} word The word (current page title).
 * @param {string} langCode The code of the selected language. Used to know where to insert the code.
 * @param {string} sortKey The sort key. Used to insert the {{clé de tri}} template.
 * @throws If the given language code is invalid.
 */
function insertWikitext(wikitext, word, langCode, sortKey) {
  const language = languages.getLanguage(langCode);
  if (!language) throw new Error(`Invalid language code: ${langCode}`);
  const languageName = language.sortKey || language.name;

  const sortKeyTemplate = `\n{{clé de tri|${sortKey}}}`;

  const text = getText() || "";

  if (text.trim() === "") {
    setText(wikitext + sortKeyTemplate);
    return;
  }

  const noSortKeyTemplate = sortKey !== word && !text.includes("{{clé de tri");

  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = sectionRegexp.exec(line);
    if (!match) continue;
    const sectionLang = languages.getLanguage(match[1].trim(), true);
    const sectionLangName = sectionLang.sortKey || sectionLang.name;
    if (!sectionLangName || compareNames(languageName, sectionLangName) > 0)
      continue;

    if (i > 0 && lines[i - 1].trim() !== "") wikitext = "\n" + wikitext;
    lines.splice(i, 0, ...wikitext.split("\n"));
    let result = lines.join("\n").trim();
    if (noSortKeyTemplate) result += "\n" + sortKeyTemplate;
    setText(result);
    selectLines(i);
    return;
  }

  if (noSortKeyTemplate) wikitext += sortKeyTemplate;
  setText(text.trim() + "\n\n" + wikitext);
  selectLines(lines.length);
}

/**
 * Set the value of the edit summary input.
 * @param {string} editSummary The edit summary to use.
 */
function setEditSummary(editSummary) {
  /** @type {HTMLInputElement} */
  const summaryInput = document.getElementById("wpSummary");
  summaryInput.value = editSummary;
}

const conv = languages.getLanguageName("conv");
const french = languages.getLanguageName("fr");

/**
 * Compare two language names.
 * @param {string} name1 A language name.
 * @param {string} name2 Another language name.
 * @returns A positive value if `name1` is after `name2`, a negative value if `name1` is before `name2`, 0 if both names are equal.
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
    codeMirrorEditor = codeMirrorElement && codeMirrorElement.CodeMirror;
  }
  return codeMirrorEditor;
}

/**
 * Select the given line(s).
 * @param {number} start The index of the first line to select.
 * @param {number?} end The index of the last line to select.
 */
function selectLines(start, end) {
  if (!end) end = start;

  const codeMirror = getCodeMirrorEditor();
  if (codeMirror) {
    codeMirror.setSelection(
      { line: start, ch: 0 },
      {
        line: end,
        ch: codeMirror.getLine(end).length,
      }
    );
  } else {
    const editor = getDefaultEditor();
    const text = editor.value;
    editor.selectionStart =
      text.split("\n").slice(0, start).join("\n").length + 1;
    editor.selectionEnd = text
      .split("\n")
      .slice(0, end + 1)
      .join("\n").length;
  }
}

// </nowiki>
/**
 * This module exports function to interact with the wikitext editor.
 * It is compatible with CodeMirror.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/editor.js]]
 */
export default {
  insertWikitext,
  setEditSummary,
  extractLanguageCodes,
};
