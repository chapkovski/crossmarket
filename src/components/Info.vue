<template>
    <div>
        <div v-if="!merged" class="d-flex">
            <v-sheet elevation="3" class="d-flex pa-3 align-center rounded-sm flex-column mx-3" height="100px">
                <div class="font-weight-bold mx-1 mr-3">Market A value:</div>
                <div class="d-flex flex-row">
                    <v-sheet outlined class="d-flex align-center rounded-l-xl pa-2 ">
                        <div class="d-flex align-center  ">
                            In assets:
                            <div class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill">
                                ${{ stock_value_by_market("A").toFixed(2) }}
                            </div>
                        </div>
                    </v-sheet>
                    <v-sheet outlined class="d-flex align-center ml-1 pa-2">
                        <div class="d-flex align-center  ">
                            In cash:
                            <div class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill">
                                ${{ market_A.cash.toFixed(2) }}
                            </div>
                        </div>
                    </v-sheet>
                    <v-sheet outlined class="d-flex align-center ml-1 pa-2 rounded-r-xl" v-if="false">
                        <div class="d-flex align-center  font-weight-bold ">
                            Total:
                            <div class="ml-1 pa-2 red   white--text text-no-wrap rounded-pill">
                                ${{ total_in_market("A").toFixed(2) }}
                            </div>
                        </div>
                    </v-sheet>
                </div>
            </v-sheet>
            <v-sheet elevation="3" class="d-flex pa-3 align-center rounded-sm flex-column mx-3" height="100px">
                <div class="font-weight-bold mx-1 mr-3">Market B value:</div>
                <div class="d-flex flex-row">
                    <v-sheet outlined class="d-flex align-center rounded-l-xl pa-2 ">
                        <div class="d-flex align-center  ">
                            In assets:
                            <div class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill">
                                ${{ stock_value_by_market("B").toFixed(2) }}
                            </div>
                        </div>
                    </v-sheet>
                    <v-sheet outlined class="d-flex align-center ml-1 pa-2">
                        <div class="d-flex align-center  ">
                            In cash:
                            <div class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill">
                                ${{ market_B.cash.toFixed(2) }}
                            </div>
                        </div>
                    </v-sheet>
                    <v-sheet outlined class="d-flex align-center ml-1 pa-2 rounded-r-xl" v-if="false">
                        <div class="d-flex align-center  font-weight-bold ">
                            Total:
                            <div class="ml-1 pa-2 red   white--text text-no-wrap rounded-pill">
                                ${{ total_in_market("B").toFixed(2) }}
                            </div>
                        </div>
                    </v-sheet>
                </div>
            </v-sheet>
        </div>
        <div v-if="merged">
            <v-sheet elevation="3" class="d-flex pa-3 align-center rounded-sm" height="64px">
                <div class="font-weight-bold mx-1 mr-3">
                    Total markets A and B value:
                </div>
                <v-sheet outlined class="d-flex align-center rounded-l-xl pa-2 ">
                    <div class="d-flex align-center  ">
                        In assets:
                        <div class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill">
                            ${{ total_stock_value().toFixed(2) }}
                        </div>
                    </div>
                </v-sheet>
                <v-sheet outlined class="d-flex align-center ml-1 pa-2">
                    <div class="d-flex align-center  ">
                        In cash:
                        <div class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill">
                            ${{ total.cash.toFixed(2) }}
                        </div>
                    </div>
                </v-sheet>
                <v-sheet outlined class="d-flex align-center ml-1 pa-2 rounded-r-xl" v-if="false">
                    <div class="d-flex align-center  font-weight-bold ">
                        Total:
                        <div class="ml-1 pa-2 red   white--text text-no-wrap rounded-pill">
                            ${{ total_in_both_markets().toFixed(2) }}
                        </div>
                    </div>
                </v-sheet>
            </v-sheet>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
    data: () => ({}),
    computed: {
        ...mapGetters([
            "stock_value_by_market",
            "total_stock_value",
            "total_in_market",
            "total_in_both_markets",
        ]),
        ...mapState(["socket", "total", "market_A", "market_B", "merged"]),
    },

    methods: {},
};
</script>

<style scoped>

</style>
