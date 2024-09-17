<template>
  <v-row dense no-gutters>
    <v-col cols="4">
      <IntegerInput v-model="model.hour" label="" :max="23" required />
    </v-col>
    <v-col cols="1" class="d-flex justify-center">
      <strong class="mt-2"> : </strong>
    </v-col>
    <v-col cols="4">
      <IntegerInput v-model="model.min" label="" :max="59" required />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface HourProps {
  hour: string;
  min: string;
}
// import { v4 as uuidv4 } from "uuid";
// import { useField } from "vee-validate";
// import { toTypedSchema } from "@vee-validate/zod";
// import * as zod from "zod";
import moment from "moment";

const model = defineModel<HourProps>({
  default: {
    hour: moment().format("HH"),
    min: moment().format("mm"),
  },
});
</script>
