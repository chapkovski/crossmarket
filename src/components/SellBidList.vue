<template>
  <v-col style="height:100%" class="mx-3 d-flex flex-column my-1">
    <v-card class="d-flex flex-column buysellcard" fill-height>
      <v-app-bar class="flex-grow-0" dense>
        Selling bids
      </v-app-bar>
      <v-card-text class="overflow-y-auto" style="margin-bottom:48px">
        <v-list class="listouter1">
          <v-list-item-group
            v-model="selectedSellingBid"
            active-class="border"
            color="indigo"
            class="listouter2"
          >
            <div id="inner">
              <v-list-item
                :disabled="item.trader == $store.state.player_id"
                v-for="(item, i) in bids"
                :key="i"
                :id="`li_${item}`"
                dense
              >
                <v-list-item-content>
                  <v-list-item-title
                    >{{ item.value }}
                    <span v-if="item.trader == $store.state.player_id">
                      (Your own)</span
                    >
                    <span v-if="item.trader__virtual && !item.trader__is_mm">
                      (V{{ item.trader }})</span
                    >
                    <span v-if="item.trader__is_mm">
                      (MM)
                    </span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list-item-group>
        </v-list>
      </v-card-text>

      <v-footer class="bottom_footer">
        <v-btn color="green" :disabled="emptyBid" @click="transact">{{
          btntext
        }}</v-btn
        ><v-spacer></v-spacer>
        <v-btn color="red" class="ml-2" @click="cancelBid" v-if="onMarketSize">
          Cancel
        </v-btn>
      </v-footer>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
  components: {},
  props: ["name", "bids", "type"],

  data() {
    return {};
  },
  computed: {
    ...mapState(["player_id"]),
    ...mapGetters(["get_cash", "is_trader_on_market_size"]),
    selectedSellingBid() {
      if (this.bids.length > 0) {
        const firstBid = this.bids[0];
        if (firstBid.trader !== this.player_id) {
          return 0;
        }
      }
      return null;
    },

    onMarketSize() {
      return this.is_trader_on_market_size(this.name, this.type);
    },
    cash_available() {
      return this.get_cash(this.name);
    },
    emptyBid() {
      return (
        _.isNil(this.selectedSellingBid) ||
        this.cash_available < this.selectedBidValue.value
      );
    },
    selectedBidValue() {
      return this.bids[this.selectedSellingBid];
    },
    btntext() {
      if (this.emptyBid) {
        return "Buy";
      } else {
        return `Buy 1 ${this.name} for ${this.selectedBidValue.value}`;
      }
    },
  },
  methods: {
    ...mapActions(["sendMessage"]),
    async cancelBid() {
      await this.sendMessage({
        action: "cancelBid",
        trader_id: this.player_id,
        market: this.name,
        type: this.type,
      });
    },
    async transact() {
      if (this.cash_available >= this.selectedBidValue.value) {
        await this.sendMessage({
          action: "takeBid",
          bid_id: this.selectedBidValue.id,
        });
      }
      
    },
  },
};
</script>
<style scoped>
.v-list-item-group .v-list-item--active {
  color: white;

  background: orange;
}
.v-list-item--active .v-list-item__title {
  font-weight: bolder !important;
  font-size: 1rem !important;
}
</style>
