<template>
  <v-col style="height:100%" class="mx-3 d-flex flex-column my-1">
    <v-card
      class="d-flex flex-column buysellcard"
      fill-height
      style="height:95%"
    >
      <v-app-bar class="flex-grow-0" dense>
        Buying bids
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
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list-item-group>
        </v-list>
      </v-card-text>

      <v-footer class="bottom_footer">
        <v-btn color="red" :disabled="emptyBid" @click="transact">{{
          btntext
        }}</v-btn>
      </v-footer>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
  components: {},
  name: "BuyBidList",
  props: ["name", "bids"],
  data() {
    return {
      selectedSellingBid: null,
    };
  },
  computed: {
    ...mapGetters(["get_num_shares"]),
    current_num_shares() {
      return this.get_num_shares(this.name);
    },
    emptyBid() {
      return _.isNil(this.selectedSellingBid) || this.current_num_shares === 0;
    },
    selectedBidValue() {
      return this.bids[this.selectedSellingBid];
    },
    btntext() {
      if (this.emptyBid) {
        return "Sell";
      } else {
        return `Sell 1 ${this.name} for ${this.selectedBidValue.value}`;
      }
    },
  },
  methods: {
    ...mapActions(["sendMessage"]),
    async transact() {
      if (this.current_num_shares > 0) {
        await this.sendMessage({
          action: "takeBid",
          bid_id: this.selectedBidValue.id,
        });
      }
      this.selectedSellingBid = null;
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
