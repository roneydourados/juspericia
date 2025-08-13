<template>
  <v-text-field
    v-model="inputValue"
    :label="dynamicLabel"
    :error-messages="meta.touched ? errorMessage : ''"
    :clearable="clearable"
    :disabled="disabled"
    persistent-hint
    variant="outlined"
    density="compact"
    rounded="xl"
    base-color="tooltipTextColor"
    color="tooltipTextColor"
    @update:model-value="handleInputAndFormat"
    @blur="validateAndEmitOnBlur"
  >
    <template v-slot:prepend-inner>
      <v-menu v-model="menu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            icon
            size="x-small"
            v-bind="props"
            @click="handleClickMenu"
          >
            <v-icon
              icon="mdi-calendar-multiselect-outline"
              size="20"
              color="primary"
              class="mt-1"
            />
          </v-btn>
        </template>
        <v-locale-provider locale="pt">
          <v-date-picker
            v-model="date"
            elevation="8"
            rounded="lg"
            hide-actions
            hide-title
            hide-header
            color="primary"
            :view-mode="viewMode"
            @update:model-value="handleUpdateDatePickerData"
          />
        </v-locale-provider>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
type ViewMode = "month" | "months" | "year";

import dayjs from "dayjs";
import "dayjs/locale/pt";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import { v7 as uuid } from "uuid";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useField } from "vee-validate";
import { computed, ref, watch, onMounted, type PropType } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  required: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  min: { type: Number },
  viewMode: { type: String as PropType<ViewMode>, default: "month" },
});

const modelValue = defineModel<string | null>("modelValue", {
  default: null,
  required: false,
});

const date = ref<Date | null>(null);
const menu = ref(false);
const inputValue = ref("");
const fieldName = ref(uuid());

const dynamicLabel = computed(() =>
  props.required ? `${props.label}*` : props.label
);

const validationSchema = computed(() => {
  let schema: zod.ZodTypeAny = zod
    .string()
    .nullable()
    .refine((val) => {
      if (!props.required && (val === null || val === "")) return true;
      if (props.required && (val === null || val === "")) return false;
      return dayjs(val, "YYYY-MM-DD", true).isValid();
    }, "Data inválida.");

  if (props.required) {
    schema = schema.refine(
      (val) => val !== null && val !== "",
      "Campo não pode ser vazio!"
    );
  }

  return toTypedSchema(schema);
});

const { value, errorMessage, meta, handleChange } = useField(
  fieldName,
  validationSchema,
  { initialValue: modelValue.value }
);

onMounted(() => {
  if (
    modelValue.value &&
    dayjs(modelValue.value, "YYYY-MM-DD", true).isValid()
  ) {
    inputValue.value = dayjs(modelValue.value).format("DD/MM/YYYY");
    date.value = dayjs(modelValue.value).toDate();
    handleChange(modelValue.value, false);
  } else {
    inputValue.value = "";
    date.value = null;
    value.value = null;
    handleChange(null, false); // Não força validação imediata
  }
});

watch(modelValue, (newValue) => {
  if (newValue && dayjs(newValue, "YYYY-MM-DD", true).isValid()) {
    inputValue.value = dayjs(newValue).format("DD/MM/YYYY");
    date.value = dayjs(newValue).toDate();
  } else {
    inputValue.value = "";
    date.value = null;
  }
  handleChange(newValue);
});

const handleInputAndFormat = (newVal: string) => {
  // Atualiza diretamente o inputValue com o que o usuário digitou
  inputValue.value = newVal;

  const cleaned = newVal.replace(/\D/g, "");
  let formatted = "";

  if (cleaned.length <= 2) {
    formatted = cleaned;
  } else if (cleaned.length <= 4) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  } else {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
      4,
      8
    )}`;
  }

  if (formatted !== inputValue.value) {
    inputValue.value = formatted;
  }

  let apiValue: string | null = null;

  if (
    formatted.length === 10 &&
    dayjs(formatted, "DD/MM/YYYY", true).isValid()
  ) {
    apiValue = dayjs(formatted, "DD/MM/YYYY").format("YYYY-MM-DD");
  }

  value.value = apiValue;
  modelValue.value = apiValue;

  handleChange(apiValue); // Não força validação ainda
};

const validateAndEmitOnBlur = () => {
  const inputVal = inputValue.value;
  let apiValue: string | null = null;

  if (inputVal.length === 10 && dayjs(inputVal, "DD/MM/YYYY", true).isValid()) {
    apiValue = dayjs(inputVal, "DD/MM/YYYY").format("YYYY-MM-DD");
  } else if (!props.required && (!inputVal || inputVal.length === 0)) {
    apiValue = null;
  }

  value.value = apiValue;
  modelValue.value = apiValue;

  handleChange(apiValue, true); // Força validação final e marca como "touched"
};

const handleClickMenu = () => {
  if (
    inputValue.value &&
    dayjs(inputValue.value, "DD/MM/YYYY", true).isValid()
  ) {
    date.value = dayjs(inputValue.value, "DD/MM/YYYY").toDate();
  } else if (
    modelValue.value &&
    dayjs(modelValue.value, "YYYY-MM-DD", true).isValid()
  ) {
    date.value = dayjs(modelValue.value).toDate();
  } else {
    date.value = null;
  }
  menu.value = true;
};

const handleUpdateDatePickerData = (newDate: Date | null) => {
  if (newDate) {
    const formattedDisplay = dayjs(newDate).format("DD/MM/YYYY");
    const formattedApi = dayjs(newDate).format("YYYY-MM-DD");

    inputValue.value = formattedDisplay;
    value.value = formattedApi;
    modelValue.value = formattedApi;
  } else {
    inputValue.value = "";
    value.value = null;
    modelValue.value = null;
  }

  handleChange(value.value);
  menu.value = false;
};
</script>
