import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    round_number: window.round_number,
    merged: Boolean(window.merged),
    player_id: window.player_id,
    total: status.total,
    market_A: status.A,
    market_B: status.B,
    bids: [],
    // TODO: this should be retrieved differently.
    priceHistory: window_history,

    socket: {
      isConnected: false,
      message: "",
      reconnectError: false,
    },
  },
  getters: {
    is_trader_on_market: (state) => (market) => {
      const isTraderThere = _.find(
        state.bids,
        _.matches({ market: market, trader: state.player_id })
      );
      return _.isObject(isTraderThere);
    },
    is_trader_on_market_size: (state, getters) => (market, type) => {
      return _.isObject(getters.currentActiveOrder(market, type));
    },
    currentActiveOrder: (state) => (market, type) => {
      const isTraderThere = _.find(
        state.bids,
        _.matches({ market: market, trader: state.player_id, type: type })
      );
      return isTraderThere;
    },
    total_in_market: (state, getters) => (market) => {
      const stock_value = getters.stock_value_by_market(market);
      const cash = state[`market_${market}`].cash;
      return stock_value + cash;
    },
    total_in_both_markets: (state, getters) => () => {
      const A = getters.total_in_market("A");
      const B = getters.total_in_market("B");
      return A + B;
    },
    stock_value_by_market: (state) => (market) => {
      const marketObj = state[`market_${market}`];
      const shares = marketObj.shares;
      const price = marketObj.price;
      return shares * price;
    },
    cash_by_market: (state) => (market) => {
      const marketObj = state[`market_${market}`];
      return marketObj.cash;
    },

    total_stock_value: (state, getters) => () => {
      const A = getters.stock_value_by_market("A");
      const B = getters.stock_value_by_market("B");

      return A + B;
    },
    get_cash: (state) => (market) => {
      if (state.merged) {
        return state.total.cash;
      }
      if (market === "A") {
        return state.market_A.cash;
      }
      if (market === "B") {
        return state.market_B.cash;
      }
    },
    get_num_shares: (state) => (market) => {
      if (market === "A") {
        return state.market_A.shares;
      }
      if (market === "B") {
        return state.market_B.shares;
      }
    },
    filteredBids: (state) => ({ market, type }) => {
      const order = type === "buy" ? "desc" : "asc";
      const bids = _.filter(
        state.bids,
        _.matches({ market: market, type: type })
      );
      const sortedBids = _.orderBy(bids, ["value"], [order]);
      return sortedBids;
    },
  },

  mutations: {
    SET_BIDS(state, bids) {
      state.bids = bids;
    },
    UPDATE_STATUS(state, { total, A, B }) {
      state.total = total;
      state.market_A = A;
      state.market_B = B;
    },
    UPDATE_PRICE(state, { market, price }) {
      if (market === "A") {
        state.market_A.price = price;
      }
      if (market === "B") {
        state.market_B.price = price;
      }
    },
    ADD_BID(state, bid) {
      bid.value = parseFloat(bid.value);
      state.bids.push(bid);
    },
    REMOVE_BID(state, bid_id) {
      const ind = _.findIndex(state.bids, _.matches({ id: bid_id }));
      state.bids.splice(ind, 1);
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
    async endingGame({ state, dispatch }) {
      await dispatch("sendMessage", {
        action: "gameEnds",
      });
      document.getElementById("form").submit();
    },
    getServerConfirmation(context, i) {
      console.debug(i);
    },
    setBids(context, serverMsg) {
      const { bids, status, market, price } = serverMsg;
      
      if (price) {
        context.commit("UPDATE_PRICE", { market, price });
      }
      if (status) {
        context.commit("UPDATE_STATUS", status);
        context.commit("UPDATE_PRICE", status);
      }
      context.commit("SET_BIDS", bids);
    },
    addBid(context, serverMsg) {
      const { bid, bid_to_remove } = serverMsg;
      bid_to_remove && context.commit("REMOVE_BID", bid_to_remove);

      context.commit("ADD_BID", bid);
    },
    from_huey(context, serverMsg) {
      console.debug("MESSAGE MOTHER FUCKER!!!", JSON.stringify(serverMsg));
    },
    removeBid(context, serverMsg) {
      const { bid_id, market, price } = serverMsg;
      context.commit("REMOVE_BID", bid_id);
      if (price) {
        context.commit("UPDATE_PRICE", { market, price });
      }
    },
    remove_and_update(context, serverMsg) {
      const { bid_id, status } = serverMsg;
      context.commit("REMOVE_BID", bid_id);
      context.commit("UPDATE_STATUS", status);
      context.commit("UPDATE_PRICE", status);
    },
    sendMessage: async function({ state }, message) {
      const { market_A, market_B, player_id } = state;

      await Vue.prototype.$socket.sendObj({
        player_id,
        marketData: { market_A, market_B },
        ...message,
      });
    },
  },
  modules: {},
});
