// <nowiki>
import { createMwApp } from "vue";
import U from "./wiki_deps/wikt.core.user.js";
import App from "./App.vue";

const version = "6.0";
console.log(`Chargement de Gadget-wikt.create-new-entry (v${version})…`);

(async () => {
  /**
   * @type {import("./types.js").AppConfig}
   */
  const config = {
    userGender: await U.getGender(
      new mw.Api({ userAgent: `Gadget-wikt.create-new-entry/${version}` })
    ),
  };

  const app = createMwApp(App);
  app.provide("config", config);
  app.mount("#app");
})();
// </nowiki>
