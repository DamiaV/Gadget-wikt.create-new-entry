/**
 * (fr)
 * Ce gadget permet de facilement créer une section dans une langue donnée
 * par l’intermédiaire d’un formulaire.
 *
 * (en)
 * This gadget helps create a section in the given language through a form.
 *
 * == Version history ==
 *
 * === v2.x (2012-12-10 - 2013-02-28) ===
 * v2.0   2012-12-10
 * v2.1   2012-12-26
 * v2.2   2013-01-01
 * v2.3   2013-01-04 dialog box functions restructuration
 * v2.4   2013-01-29 cookies to store preferences
 *
 * === v3.x (2013-02-28 - 2014-01-22) ===
 * v3.0   2013-02-28 tool integration into pages
 *
 * === v4.x (2014-01-22 - 2020-07-29) ===
 * v4.0   2014-01-22 support for new editable sections syntax
 *
 * === v5.x (2020-07-29 - 2025-09-??) ===
 * v5.0   2020-07-29 full rewrite, migration to OOUI
 * v5.0.1 2020-08-01 using {{lien}} for links, reworked toolbar
 * v5.0.2 2020-08-02 added missing sections
 * v5.0.3 2020-08-05 added date template in etymology section
 * v5.0.4 2020-08-05 reordering level 4 sections
 * v5.0.5 2020-08-10 sister projects search links now update on language selection
 * v5.0.6 2020-08-11 inserting : and # if missing
 * v5.0.7 2020-08-20 added default grammatical classes for undefined languages
 * v5.0.8 2020-08-25 added {{type}} template to verbs, fields to insert an image,
 *                   field to add categories; removed lang parameter for some
 *                   interwiki templates
 * v5.1   2020-09-20 added pronunciation section field; added ISO 639-3 code to Language
 *                   class; removed sources section; added help bubbles to some fields
 * v5.1.1 2021-05-08 Edit notice is no longer overwritten by the button
 * v5.1.2 2021-06-15 Merged language definitions into main file
 * v5.1.3 2021-06-28 Moved dependencies to [[MediaWiki:Gadgets-definition]]
 * v5.2   2021-07-07 Non-predefined languages now show actual name instead of code if
 *                   defined in [[MediaWiki:Gadget-translation editor.js/langues.json]].
 *                   Clearer indication of currently selected language.
 *                   Not using wikt.gadgets object that was causing bugs.
 * v5.3   2021-07-07 Prevent code from being inserted if definition field is empty.
 *                   Word type, gender and number are not selected by default anymore
 *                   (except if there is only one choice).
 * v5.4   2022-11-26 Separate fields for each definition and their associated examples.
 * v5.4.1 2022-11-28 Convert to ES6.
 * v5.4.2 2024-03-09 Add buttons to format text in some fields (bold and italic).
 * v5.4.3 2024-08-30 Add option to hide additional sections fields from a user’s [[Special:MyPage/common.js]].
 * v5.4.4 2025-01-22 Add Breton language.
 * v5.4.5 2025-02-06 Add “locution-phrase” word type.
 * v5.5   2025-04-05 Add Portuguese language.
 * v5.6   2025-04-05 Make grammatical properties generic.
 * v5.6.1 2025-04-05 Split gadget into several files.
 * v5.7   2025-05-22 Use new [[MediaWiki:Gadget-wikt.core.languages.json]].
 * v5.8   2025-05-26 Conversion into a module.
 * v5.8.1 2025-06-04 Notification when the code is inserted.
 * v5.9   2025-06-25 Refactor to enable by default.
 * v5.9.1 2025-07-10 Better handling of English adjectives.
 *
 * === v6.x (2025-09-?? -) ===
 * v6.0   2025-09-?? Full rewrite in Vue.js + Codex.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/main.js]]
 */
// <nowiki>
import { createMwApp } from "vue";
import U from "./wiki_deps/wikt.core.user.js";
import pages from "./pages.js";
import W from "./wikitext.js";
import App from "./App.vue";

const version = "6.0";
console.log(`Chargement de Gadget-wikt.create-new-entry (v${version})…`);

(async () => {
  const api = new mw.Api({
    userAgent: `Gadget-wikt.create-new-entry/${version}`,
  });
  /**
   * @type {import("./types.js").AppConfig}
   */
  const config = {
    api,
    word: mw.config.get("wgPageName").replaceAll("_", " "),
    userGender: await U.getGender(api),
    namespaces: await pages.getNamespacesInfo(api),
  };

  const app = createMwApp(App, {
    existingLanguageSections: [], // TODO extract lang codes from edit form
    /**
     * Called when the form is submitted.
     * @param {import("./types.js").FormData} formData The submitted form data.
     */
    onSubmit(formData) {
      console.log(formData);
      const wikitext = W.generateWikitext(formData, config.word);
      console.log(wikitext);
      // TODO insert wikitext
    },
  });
  app.provide("config", config);
  app.mount("#gadget-create-new-entry");
})();
// </nowiki>
