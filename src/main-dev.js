import { createApp } from "vue";
import App from "./App.vue";
import pages from "./pages.js";
import W from "./wikitext.js";

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
