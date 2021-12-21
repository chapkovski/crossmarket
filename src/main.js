import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import router from "./router";
import VueNativeSock from "vue-native-websocket";

const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
const ws_path = ws_scheme + "://" + window.location.host + window.socket_path;

Vue.use(VueNativeSock, ws_path, {
  store: store,
  format: "json",
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});
import vueAwesomeCountdown from "vue-awesome-countdown";

Vue.config.productionTip = false;
Vue.use(vueAwesomeCountdown, "vac");

new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
