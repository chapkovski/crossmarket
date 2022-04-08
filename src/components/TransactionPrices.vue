<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn  color="green" dark v-bind="attrs" v-on="on" class="m-1" width="150">
        Storico dei Prezzi
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Price history for both markets</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">
            Close
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <chart-module v-if="dialog"></chart-module>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from "lodash";
import ChartModule from "@/components/ChartModule.vue";
export default {
  components: { ChartModule },
  props: ["marketName"],
  name: "TransactionPrices",

  data() {
    return {
      dialog: false,
    };
  },
};
</script>
