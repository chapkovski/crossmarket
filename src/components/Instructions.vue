<template>
  <v-dialog v-model="dialog" scrollable transition="dialog-bottom-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="red" dark v-bind="attrs" v-on="on" class="m-1" width="150">
        Instructions
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Instructions</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">
            Close
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text v-html="instructions"> </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Instructions",

  data() {
    return {
      instructions: document.getElementById("instructions").innerHTML,
      dialog: false,
    };
  },
};
</script>
