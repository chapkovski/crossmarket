<template>
    <v-app id="inspire">
        <v-app-bar app height="120">
            <timer @dayDone="submit" />
            <info />
            <v-spacer></v-spacer>
            <div class="d-flex flex-column">
                <transaction-prices v-if=" $store.state.round_number>1 "></transaction-prices>
                <instructions />
            </div>
        </v-app-bar>
        <v-main>
            <v-row fill-height class="d-flex align-stretch" style="height:100%">
                <v-col cols="6">
                    <market name="A" :stocksData="{
                      q: market_A.shares,
                      price: market_A.price,
                      money: availableMoney('A'),
                    }" />
                </v-col>
                <v-col cols="6">
                    <market name="B" :stocksData="{
                      q: market_B.shares,
                      price: market_B.price,
                      money: availableMoney('B'),
                    }" />
                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script>
import _ from "lodash";
import Timer from "@/components/Timer";
import Info from "@/components/Info";
import Market from "@/components/MarketWrapper";
import { mapActions, mapState, mapGetters } from "vuex";
import TransactionPrices from "@/components/TransactionPrices.vue";
import Instructions from "@/components/Instructions.vue";
export default {
    components: { Market, TransactionPrices, Timer, Info, Instructions },
    data: () => ({
        cards: ["Today", "Yesterday"],
        innerList: _.range(1, 10),

        drawer: null,
    }),
    computed: {
        ...mapGetters([
            "stock_value_by_market",
            "total_stock_value",
            "total_in_market",
            "total_in_both_markets",
        ]),
        ...mapState(["socket", "total", "market_A", "market_B", "merged"]),
    },
    watch: {
        socket(v) {
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
    },
    methods: {
        async submit() {
            await this.endingGame();
        },
        ...mapActions(["sendMessage", "endingGame"]),
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
