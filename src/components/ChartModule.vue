<template>
  <v-container fluid style="height: 50vh;">
    <v-col cols="12">
      <highcharts
        ref="priceGraph"
        :options="chartOptions"
        :constructorType="'stockChart'"
        class="hc"
      ></highcharts>
    </v-col>
  </v-container>
</template>

<script>
var seriesOptions = [],
  seriesCounter = 0,
  names = ["MSFT", "AAPL", "GOOG"];
import axios from "axios";
import { mapGetters, mapActions, mapState } from "vuex";
import Highcharts from "highcharts";
import stockInit from "highcharts/modules/stock";
import _ from "lodash";
stockInit(Highcharts);
import { Chart } from "highcharts-vue";
export default {
  components: {
    highcharts: Chart,
  },
  name: "ChartModule",

  data() {
    return {
      chartOptions: {
        time: {
          useUTC: false,
        },
        chart: {
          height: "100%",
          events: {
            load: function(event) {
              event.target.reflow();
            },
          },
        },

        series: [
          { name: "A", type: "line", data: this.seriesA },
          { name: "B", type: "line", data: this.seriesB },
        ],
      },
    };
  },
  watch: {
    priceHistory() {
      this.$nextTick(() => {
        this.$refs.priceGraph.chart.setSize(
          window.inneWidth - 100,
          window.innerHeight - 150
        );
        this.$refs.priceGraph.chart.reflow();
      });
    },
  },
  computed: {
    ...mapState(["priceHistory"]),
    seriesA() {
      return this.priceHistory.A;
    },
    seriesB() {
      return this.priceHistory.B;
    },
  },
  mounted() {
   
    this.chartOptions.series[0].data = this.seriesA;
    
    this.chartOptions.series[1].data = this.seriesB;

    this.$nextTick(() => {
      this.$refs.priceGraph.chart.setSize(
        window.inneWidth - 100,
        window.innerHeight - 150
      );
      this.$refs.priceGraph.chart.reflow();
    });
  },
};
</script>
