<template>
  <v-row dense class="pa-4">
    <v-col cols="12" lg="3">
      <v-radio-group
        v-model="value.period"
        inline
        @update:model-value="handleChangeFilterType"
      >
        <v-radio label="Hoje" value="day"></v-radio>
        <v-radio label="Semana" value="week"></v-radio>
        <v-radio label="Mês" value="month"></v-radio>
        <v-radio label="Ano" value="year"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="12" lg="2">
      <DatePicker
        v-model="value.start"
        label="Data Inicial"
        :required="required"
      />
    </v-col>
    <v-col cols="12" lg="2">
      <DatePicker v-model="value.end" label="Data Final" :required="required" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import moment from "moment";

import { uuidv7 } from "uuidv7";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { PropType } from "vue";

defineProps({
  modelValue: {
    type: Object as PropType<DateInterval>,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);

const fieldName = computed<MaybeRef>(() => {
  return uuidv7();
});

const validationRules = computed<MaybeRef>(() => {
  return toTypedSchema(zod.object({}).nullish().optional());
});

const { value } = useField<DateInterval>(fieldName, validationRules, {
  syncVModel: true,
});

onMounted(() => {
  value.value.period = "day";
  handleChangeFilterType();
});

const handleChangeFilterType = () => {
  switch (value.value.period) {
    case "day":
      value.value.start = moment().format("YYYY-MM-DD");
      value.value.end = moment().format("YYYY-MM-DD");
      break;
    case "week":
      value.value.start = moment().startOf("week").format("YYYY-MM-DD");
      value.value.end = moment().endOf("week").format("YYYY-MM-DD");
      break;
    case "month":
      value.value.start = moment().startOf("month").format("YYYY-MM-DD");
      value.value.end = moment().endOf("month").format("YYYY-MM-DD");
      break;
    case "year":
      value.value.start = moment().startOf("year").format("YYYY-MM-DD");
      value.value.end = moment().endOf("year").format("YYYY-MM-DD");
      break;
  }
};
</script>
