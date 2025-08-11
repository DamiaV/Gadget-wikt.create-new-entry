import { createMwApp } from "vue";
import App from "./App.vue";

const version = "6.0";
console.log(`Chargement de Gadget-wikt.create-new-entry (v${version})…`);

createMwApp(App).mount("#app");
