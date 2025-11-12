// <nowiki>
import edit from "./wiki_deps/wikt.core/edit.js";
import languages from "./wiki_deps/wikt.core/languages.js";

const Editor = edit.Editor;
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

  const text = Editor.getText() || "";

  const missingSortKeyTemplate =
    sortKey !== word && !text.includes("{{clé de tri");

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
    const wikitextLines = wikitext.split("\n");
    lines.splice(i, 0, ...wikitextLines);
    let result = lines.join("\n").trim();
    if (missingSortKeyTemplate) result += "\n" + sortKeyTemplate;
    Editor.setText(result);
    Editor.setLineSelection(i, i + wikitextLines.length - 1);
    Editor.focus();
    return;
  }

  if (missingSortKeyTemplate) wikitext += sortKeyTemplate;
  const leadingText = text.trim();
  let lineOffset = 0;
  if (leadingText) {
    wikitext = leadingText + "\n\n" + wikitext;
    lineOffset = leadingText.split("\n").length + 1;
  }
  Editor.setText(wikitext);
  Editor.setLineSelection(lineOffset, wikitext.split("\n").length - 1);
  Editor.focus();
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
  const text = Editor.getText() || "";
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
