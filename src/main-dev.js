import { createApp } from "vue";
import App from "./App.vue";
import pages from "./pages.js";

(async () => {
  /**
   * @type {import("./types.js").AppConfig}
   */
  const config = {
    word: "test",
    userGender: "unknown",
    namespaces: await pages.getNamespacesInfo(),
  };

  const app = createApp(App, {
    existingLanguageSections: [],
  });
  app.provide("config", config);
  app.mount("#gadget-create-new-entry");
})();
