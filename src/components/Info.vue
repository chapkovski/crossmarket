<template>
    <div>
        <div v-if="!merged" class="ma-1 d-flex justify-center align-center">
            <v-sheet elevation="3" class="ma-1 d-flex justify-center align-center" height="80">
                <div class="d-flex flex-row">
                    <v-sheet outlined class="d-flex align-center ml-1 pa-2 rounded-pill">
                        <div class="d-flex align-center  ">
                            Contante Disponibile al Mercato A:
                            <div class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill">
                                ${{ market_A.cash.toFixed(2) }}
                            </div>
                        </div>
                    </v-sheet>
                </div>
            </v-sheet>
            <v-sheet elevation="3" class="d-flex pa-3 align-center rounded-sm flex-column mx-3" height="80">
                <div class="d-flex flex-row">
                    <v-sheet outlined class="d-flex align-center ml-1 pa-2 rounded-pill">
                        <div class="d-flex align-center  ">
                            Contante Disponibile al Mercato B:
                            <div class="ml-1 pa-2 primary   white--text text-no-wrap rounded-pill">
                                ${{ market_B.cash.toFixed(2) }}
                            </div>
                        </div>
                    </v-sheet>
                </div>
            </v-sheet>
        </div>
        <div v-if="merged">
            <v-sheet elevation="3" class="d-flex pa-3 align-center rounded-sm" height="64px">
                <div class="font-weight-bold mx-1 mr-3">
                    Contante Disponibile:
                </div>
    
                <v-sheet outlined class="d-flex align-center ml-1 pa-2">
                    <div class="d-flex align-center  ">
    
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
