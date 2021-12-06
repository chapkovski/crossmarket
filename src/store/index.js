import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bids: [],

    socket: {
      isConnected: false,
      message: "",
      reconnectError: false,
    },
  },
  getters: {
    filteredBids: (state) => ({market, type}) => {
      return _.filter(state.bids, _.matches({ market: market, type: type }));
    },
  },

  mutations: {
    SET_BIDS(state, bids) {
      state.bids = bids;
    },
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget;

      state.socket.isConnected = true;
    },
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = false;
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event);
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      state.socket.message = message;
      console.debug("MESSAGE", message);
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count);
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
  },
  actions: {
    getServerConfirmation(context, i) {
      console.debug(i);
    },
    setBids(context, serverMsg) {
      console.debug(serverMsg);
      const { bids } = serverMsg;
      context.commit("SET_BIDS", bids);
    },
    sendMessage: async function(context, message) {
      await Vue.prototype.$socket.sendObj({ ...message });
    },
  },
  modules: {},
});
