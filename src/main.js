// <nowiki>
import { createMwApp } from "vue";
import U from "./wiki_deps/wikt.core.user.js";
import App from "./App.vue";
import pages from "./pages.js";

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
  });
  app.provide("config", config);
  app.mount("#gadget-create-new-entry");
})();
// </nowiki>
