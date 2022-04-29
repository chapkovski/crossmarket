<template>
  <v-card
    class="ma-1 d-flex justify-center align-center"
    color="red"
    height="80px"
  >
    <v-card-text>
      Tempo Rimanente:
      <v-chip color="primary">
        <countdown
          :left-time="timeLeft"
          @finish="dayOver"
          ref="timer"
          :auto-start="true"
        >
          <template v-slot:before>
            <span>{{ formattedFullTime }}</span>
          </template>

          <template v-slot:finish>
            <span>{{ formattedFullTime }}</span>
          </template>
          <template v-slot:process="timerData">
            <span>{{ ` ${timerData.timeObj.m}: ${timerData.timeObj.s}` }}</span>
          </template>
        </countdown>
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script>
const { dayLength, SEC } = window.gameParams;
const durationInMillisecs = dayLength * SEC;
import { mapState, mapGetters } from "vuex";
export default {
  data: () => ({
    timeLeft: durationInMillisecs,
    endTime: new Date().getTime() + durationInMillisecs,
  }),
  computed: {
    formattedFullTime() {
      const value = dayLength;

      return (
        Math.floor(value / 60)
          .toString()
          .padStart(2, "0") +
        ": " +
        (value % 60 ? value % 60 : "00").toString().padStart(2, "0")
      );
    },
  },

  methods: {
    dayOver() {
      this.$emit("dayDone");
    },
  },
};
</script>

<style scoped></style>
