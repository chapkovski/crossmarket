<template>
  <v-app id="inspire">
    <v-app-bar app height="70">
      <div v-if="!merged" class="d-flex">
        <v-sheet
          elevation="3"
          class="d-flex pa-3 align-center rounded-sm"
          height="64px"
        >
          <div class="font-weight-bold mx-1 mr-3">Market A value:</div>
          <v-sheet outlined class="d-flex align-center rounded-l-xl pa-2 ">
            <div class="d-flex align-center  ">
              In assets:
              <div
                class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill"
              >
                ${{ stock_value_by_market("A") }}
              </div>
            </div>
          </v-sheet>
          <v-sheet outlined class="d-flex align-center ml-1 pa-2">
            <div class="d-flex align-center  ">
              In cash:
              <div
                class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill"
              >
                ${{ market_A.cash }}
              </div>
            </div>
          </v-sheet>
          <v-sheet outlined class="d-flex align-center ml-1 pa-2 rounded-r-xl">
            <div class="d-flex align-center  font-weight-bold ">
              Total:
              <div
                class="ml-1 pa-2 red   white--text text-no-wrap rounded-pill"
              >
                ${{ total_in_market('A') }}
              </div>
            </div>
          </v-sheet>
        </v-sheet>
        <v-sheet
          elevation="3"
          class="d-flex pa-3 align-center rounded-sm"
          height="64px"
        >
          <div class="font-weight-bold mx-1 mr-3">Market B value:</div>
          <v-sheet outlined class="d-flex align-center rounded-l-xl pa-2 ">
            <div class="d-flex align-center  ">
              In assets:
              <div
                class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill"
              >
                ${{ stock_value_by_market("B") }}
              </div>
            </div>
          </v-sheet>
          <v-sheet outlined class="d-flex align-center ml-1 pa-2">
            <div class="d-flex align-center  ">
              In cash:
              <div
                class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill"
              >
                ${{ market_B.cash }}
              </div>
            </div>
          </v-sheet>
          <v-sheet outlined class="d-flex align-center ml-1 pa-2 rounded-r-xl">
            <div class="d-flex align-center  font-weight-bold ">
              Total:
              <div
                class="ml-1 pa-2 red   white--text text-no-wrap rounded-pill"
              >
                ${{ total_in_market('B')}}
              </div>
            </div>
          </v-sheet>
        </v-sheet>
      </div>
      <div v-if="merged">
        <v-sheet
          elevation="3"
          class="d-flex pa-3 align-center rounded-sm"
          height="64px"
        >
          <div class="font-weight-bold mx-1 mr-3">
            Total markets A and B value:
          </div>
          <v-sheet outlined class="d-flex align-center rounded-l-xl pa-2 ">
            <div class="d-flex align-center  ">
              In assets:
              <div
                class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill"
              >
                ${{ total_stock_value }}
              </div>
            </div>
          </v-sheet>
          <v-sheet outlined class="d-flex align-center ml-1 pa-2">
            <div class="d-flex align-center  ">
              In cash:
              <div
                class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill"
              >
                ${{ total.cash }}
              </div>
            </div>
          </v-sheet>
          <v-sheet outlined class="d-flex align-center ml-1 pa-2 rounded-r-xl">
            <div class="d-flex align-center  font-weight-bold ">
              Total:
              <div
                class="ml-1 pa-2 red   white--text text-no-wrap rounded-pill"
              >
                ${{ total_in_both_markets}}
              </div>
            </div>
          </v-sheet>
        </v-sheet>
      </div>
      <v-spacer></v-spacer>
      <transaction-prices></transaction-prices>
    </v-app-bar>
    <v-main>
      <v-row fill-height class="d-flex align-stretch" style="height:100%">
        <v-col cols="6">
          <market
            name="A"
            :stocksData="{
              q: market_A.shares,
              price: market_A.price,
              money: availableMoney('A'),
            }"
          />
        </v-col>
        <v-col cols="6">
          <market
            name="B"
            :stocksData="{
              q: market_B.shares,
              price: market_B.price,
              money: availableMoney('B'),
            }"
          />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import _ from "lodash";
import Market from "@/components/MarketWrapper";
import { mapActions, mapState, mapGetters } from "vuex";
import TransactionPrices from "@/components/TransactionPrices.vue";
export default {
  components: { Market, TransactionPrices },
  data: () => ({
    cards: ["Today", "Yesterday"],
    innerList: _.range(1, 10),

    drawer: null,
  }),
  computed: {
    ...mapGetters(["stock_value_by_market", "total_stock_value","total_in_market", "total_in_both_markets"]),
    ...mapState(["socket", "total", "market_A", "market_B", "merged"]),
  },
  watch: {
    socket(v) {
      console.debug(v);
      if (v.isConnected) {
        this.sendMessage({ app: "Mounted!" });
      }
    },
    innerList: function() {
      const newone = _.last(this.innerList);

      this.$nextTick(function() {
        const el = document.getElementById(`li_${newone}`);

        el.scrollIntoView({ behavior: "smooth" });
      });
    },
  },
  async created() {
    this.$options.sockets.onopen = async () =>
      await this.sendMessage({ name: "Trade_starts" });
    this.$options.sockets.onmessage = (data) => console.log(data);
  },
  mounted() {
    if (this.socket.isConnected) {
      this.sendMessage({ app: "Mounted!" });
    }
    // THIS ONE WE NEED ONLY AS A PLUGGER FOR IMITATING MARKET ACTIVITY WHILE DEVELOPING
    // this.stockInterval = setInterval(() => {
    //   const r = _.random(0, 10000);
    //   this.innerList.push(r);
    //   const el = this.$refs[`li_${r}`];
    //   if (el) {
    //     console.log("are we???");
    //     // Use el.scrollIntoView() to instantly scroll to the element
    //     el.scrollIntoView({ behavior: "smooth" });
    //   }
    // }, 3000);
  },
  methods: {
    ...mapActions(["sendMessage"]),
    availableMoney(market) {
      if (this.merged) {
        return this.total.cash;
      } else {
        if (market == "A") {
          return this.market_A.cash;
        }
        if (market == "B") {
          return this.market_B.cash;
        }
      }
    },
    scrollToEnd: function() {
      var container = this.$el.querySelector("#sellcontainer");

      container.scrollTop = container.scrollHeight;
    },
  },
};
</script>
