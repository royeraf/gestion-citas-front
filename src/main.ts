import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.ts";
import "./style.css";
import { createPinia } from "pinia";
import "primeicons/primeicons.css";

const pinia = createPinia();
const app = createApp(App);

app.use(router).use(pinia).mount("#app");
