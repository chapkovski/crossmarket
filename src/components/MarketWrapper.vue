<template>
  <v-card class="v-100" fill-height style="height:90vh">
    <v-toolbar height="80">
      <v-sheet class="mx-1 d-flex rounded-l-xl font-weight-bold  " outlined>
        <v-list-item>Mercato {{ name }}.</v-list-item>
      </v-sheet>
      <v-sheet class="mx-0 d-flex " outlined>
        <v-list-item>
          <v-list-item-content> </v-list-item-content>

         Numero di Azioni:
        </v-list-item>
        <v-list-item-action class="font-weight-bold">
          {{ stocksData.q }}
        </v-list-item-action>
      </v-sheet>
      <v-sheet outlined class="mx-1 rounded-r-xl ">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Prezzo Corrente {{ name }}: </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="font-weight-bold ">
            {{ stocksData.price.toFixed(2) }}
          </v-list-item-action>
        </v-list-item>
      </v-sheet>

      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="green" v-bind="attrs" v-on="on">
            Ordina {{ name }}
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Immetti un ordine di vendita/acquisto per il Mercato {{ name }}
          </v-card-title>

          <v-card-text>
            <v-list dense>
              <v-subheader>Info</v-subheader>
              <v-list-item-group color="primary">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Contante Disponibile</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-card>{{ cash_available.toFixed(2) }}</v-card>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="onMarketSize('buy')">
                  <v-list-item-content>
                    <v-list-item-title
                      >Your current buying order</v-list-item-title
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-card>
                        {{ currentActiveOrder(name, "buy").value }}</v-card
                      >
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="onMarketSize('sell')">
                  <v-list-item-content>
                    <v-list-item-title
                      >Your current selling order</v-list-item-title
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-card>
                        {{ currentActiveOrder(name, "sell").value }}</v-card
                      >
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-cash-fast</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Azioni</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-card> {{ stocksData.q }}</v-card>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-hand-coin</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Prezzo corrente</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-card> {{ stocksData.price.toFixed(2) }}</v-card>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-form v-model="valid">
              
            <v-text-field
               :rules="[rules.required, rules.min]"
              v-model="bidValue"
              label="Prezzo"
              solo
              placeholder="Prezzo"
              type="number"
              autofocus
              hint="inserire un prezzo e cliccare sul pulsante corrispondente"
              required
            ></v-text-field>
          </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              outlined
              @click="
                dialog = false;
                bidValue = null;
              "
              >Cancella
            </v-btn>
            <v-btn
              color="orange"
              @click="putBuyOrder"
              :disabled="!transactionAllowed('buy')"
            >
              {{ buy_order_button_text }}
            </v-btn>
            <v-btn
              color="green"
              @click="putSellOrder"
              :disabled="!transactionAllowed('sell')"
            >
              {{ sell_order_button_text }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-row
      style="height:calc(100vh - 190px);margin-top:20px;margin-bottom:10px"
    >
      <buy-bid-list :name="name" :bids="buyingBids" type="buy"></buy-bid-list>
      <sell-bid-list
        :name="name"
        :bids="sellingBids"
        type="sell"
      ></sell-bid-list>
    </v-row>
  </v-card>
</template>

<script>
import BuyBidList from "@/components/BuyBidList.vue";
import SellBidList from "@/components/SellBidList.vue";

import _ from "lodash";
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  props: ["name", "stocksData"],
  components: {
    BuyBidList,
    SellBidList,
  },
  name: "Market",
  data() {
    return {
      valid:true,
      selectedSellingBid: null,
      bidValue: null,
      dialog: false,
      rules: {
          required: value => !!value || 'Required.',
          min: value => value >0  || 'You should enter any positive value here',
      }
    };
  },
  computed: {
    ...mapGetters([
      "filteredBids",
      "get_cash",
      "get_num_shares",
      "is_trader_on_market",
      "is_trader_on_market_size",
      "currentActiveOrder",
    ]),
    buy_order_button_text() {
      return this.onMarketSize("buy") ? "Sostituire l'ordine di Acquisto" : "Ordine di Acquisto";
    },
    sell_order_button_text() {
      return this.onMarketSize("sell") ? "Sostituire l'ordine di Vendita" : "Ordine di Vendita";
    },
    onMarket() {
      return this.is_trader_on_market(this.name);
    },

    current_num_shares() {
      return this.get_num_shares(this.name);
    },
    cash_available() {
      return this.get_cash(this.name);
    },
    ...mapState(["player_id"]),
    buyingBids() {
      return this.filteredBids({ market: this.name, type: "buy" });
    },
    sellingBids() {
      return this.filteredBids({ market: this.name, type: "sell" });
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.bidValue = null;
      }
    },
  },
  methods: {
    ...mapActions(["sendMessage"]),
    transactionAllowed(bid_type) {
      if (!this.valid) {return false}
      if (!this.bidValue) {
        return false;
      }
      if (bid_type === "sell") {
        if (this.current_num_shares < 1) {
          return false;
        }
        if (this.onMarketSize("buy")) {
          if (
            parseFloat(this.bidValue) <=
            parseFloat(this.currentActiveOrder(this.name, "buy").value)
          ) {
            return false;
          }
        }
        return true;
      }
      if (bid_type === "buy") {
        if (this.bidValue > this.cash_available) {
          return false;
        }
        if (this.onMarketSize("sell")) {
          if (
            parseFloat(this.bidValue) >=
            parseFloat(this.currentActiveOrder(this.name, "sell").value)
          ) {
            return false;
          }
        }
        
        return true;
      }
    },
    onMarketSize(bid_type) {
      return this.is_trader_on_market_size(this.name, bid_type);
    },

    async putOrder(orderType) {
      await this.sendMessage({
        action: "addBid",
        type: orderType,
        value: this.bidValue,
        trader_id: this.player_id,
        market: this.name,
      });
      this.bidValue = null;
      this.dialog = false;
    },

    async putBuyOrder() {
      if (this.bidValue <= this.cash_available) {
        await this.putOrder("buy");
      }
    },

    async putSellOrder() {
      if (this.current_num_shares > 0) {
        await this.putOrder("sell");
      }
    },
  },
};
</script>

<style>
.small {
  font-size: 1rem;
}

.border {
  border: 2px dashed orange;
}

.listouter1 {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.listouter2 {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
}

.bottom_footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}

.buysellcard {
  height: 95%;
}
</style>
