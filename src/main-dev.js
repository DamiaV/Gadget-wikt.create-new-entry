import { createApp } from "vue";
import App from "./App.vue";

/**
 * @type {import("./types.js").AppConfig}
 */
const config = {
  userGender: "unknown",
};

const app = createApp(App);
app.provide("config", config);
app.mount("#app");
