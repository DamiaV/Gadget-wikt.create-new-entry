import { createApp } from "vue";
import App from "./App.vue";

/**
 * @type {import("./types.js").AppConfig}
 */
const config = {
  word: "test",
  userGender: "unknown",
};

const app = createApp(App, {
  existingLanguageSections: [],
});
app.provide("config", config);
app.mount("#gadget-create-new-entry");
