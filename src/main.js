// <nowiki>
import { createMwApp } from "vue";
import U from "./wiki_deps/wikt.core.user.js";
import App from "./App.vue";
import pages from "./pages.js";

const version = "6.0";
console.log(`Chargement de Gadget-wikt.create-new-entry (v${version})…`);

(async () => {
  /**
   * @type {import("./types.js").AppConfig}
   */
  const config = {
    word: mw.config.get("wgPageName"),
    userGender: await U.getGender(
      new mw.Api({ userAgent: `Gadget-wikt.create-new-entry/${version}` })
    ),
    namespaces: await pages.getNamespacesInfo(),
  };

  const app = createMwApp(App, {
    existingLanguageSections: [], // TODO extract lang codes from edit form
  });
  app.provide("config", config);
  app.mount("#gadget-create-new-entry");
})();
// </nowiki>
