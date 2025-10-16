/**
 * Main script for local testing.
 */
import { createApp } from "vue";
import pages from "./pages.js";
import requests from "./requests.js";
import types from "./types.js";
import wtext from "./wikitext.js";
import App from "./App.vue";

(async () => {
  let prefs;
  try {
    prefs = await requests.getUserPreferences();
  } catch (e) {
    console.warn("[CNE] Error:", e);
    prefs = types.createEmptyUserPreferences();
  }

  /**
   * @type {import("./types.js").AppConfig}
   */
  const config = {
    word: "test",
    userName: null,
    userGender: "unknown",
    namespaces: await pages.getNamespacesInfo(),
  };

  const app = createApp(App, {
    existingLanguageSections: [],
    userPreferences: prefs,
    /**
     * Called when the form is submitted.
     * @param {import("./types.js").FormData} formData The submitted form data.
     */
    onSubmit(formData) {
      console.log(formData);
      const wikitext = wtext.generateWikitext(formData, config.word);
      console.log(wikitext);
      // TODO insert wikitext
    },
  });
  app.provide("config", config);
  app.mount("#gadget-create-new-entry");
})();
