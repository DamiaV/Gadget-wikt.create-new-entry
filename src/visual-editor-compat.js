function extractLanguageCodes() {
  /**
   * @type {string[]}
   */
  const languageCodes = [];

  const s = ve.init.target.surface.model;
  const d = s.documentModel;
  for (const item of d.getData()) {
    if (typeof item === "object" && item.type === "mwTransclusionInline") {
      const template = JSON.parse(item.attributes.originalMw).parts[0].template;
      if (template.target.wt === "langue")
        languageCodes.push(template.params[1].wt);
    }
  }

  return languageCodes;
}

/**
 * Insert the given wikitext into the editor’s box.
 * @param {string} wikitext The wikitext to insert.
 * @param {string} word The word (current page title).
 * @param {string} langCode The code of the selected language. Used to know where to insert the code.
 * @param {string} sortKey The sort key. Used to insert the {{clé de tri}} template.
 * @throws If the given language code is invalid.
 */
function insertWikitext(wikitext, word, langCode, sortKey) {
  const s = ve.init.target.surface.model;
  const d = s.documentModel;
  let i = 0;
  for (const item of d.getData()) {
    if (typeof item === "object" && item.type === "mwTransclusionInline") {
      const template = JSON.parse(item.attributes.originalMw).parts[0].template;
      if (template.target.wt === "langue") {
        // const langCode = template.params[1].wt;
        const transaction = ve.dm.TransactionBuilder.static.newFromInsertion(
          d,
          i - 1,
          ["h", "e", "l", "l", "o"]
        );
        s.change(transaction);
      }
    }
    i++;
  }
}
