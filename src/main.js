import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/sketchy/bootstrap.min.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import BootstrapVue3 from "bootstrap-vue-3";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/routes";

library.add(faFacebook, faInstagram, faXTwitter);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);
app.use(BootstrapVue3);

app.mount("#app");
