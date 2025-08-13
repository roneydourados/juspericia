<template>
  <div class="w-100">
    <v-text-field
      v-model="value"
      :variant="variant"
      density="compact"
      rounded="xl"
      base-color="tooltipTextColor"
      color="tooltipTextColor"
      type="datetime-local"
      :label="dynamicLabel"
      :error-messages="errorMessage"
      :clearable="clearable"
      :disabled="disabled"
      :readonly="readonly"
      persistent-hint
      @click:clear="clear"
      flat
      hide-details
      single-line
      @update:model-value="sendValue"
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
              :disabled="readonly"
            >
              <v-icon
                icon="mdi-calendar-multiselect-outline"
                size="20"
                color="primary"
              />
            </v-btn>
          </template>
          <v-locale-provider locale="pt">
            <v-date-picker
              elevation="8"
              rounded="lg"
              hide-actions
              hide-title
              hide-header
              v-model="date"
              color="primary"
              @update:model-value="handleUpdateDatePickerData"
            />
          </v-locale-provider>
        </v-menu>
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useField } from "vee-validate";
import { textRequired } from "../utils";
import { uuidv7 as uuid } from "uuidv7";

type VariantType =
  | "underlined"
  | "filled"
  | "outlined"
  | "plain"
  | "solo"
  | "solo-inverted"
  | "solo-filled"
  | undefined;

const props = defineProps({
  // name: {
  //   type: String,
  //   required: true,
  // },
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String as PropType<VariantType>,
    default: "outlined",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const date = ref();
const menu = ref(false);
const fieldName = uuid();
// const fieldName = computed<MaybeRef>(() => {
//   return props.label;
// });

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          error: "Data inválida",
        })
        .min(10, "Data inválida")
        .refine((val) => {
          const date = new Date(val!);
          const isValid = dayjs(date).isValid();

          return isValid;
        }, "Data inválida")
    );
  }

  return toTypedSchema(
    zod
      .string({
        error: "Data inválida",
      })
      .optional()
      .nullish()
      .refine((val) => {
        const date = new Date(val!);
        const isValid = dayjs(date).isValid();

        return isValid;
      }, "Data inválida")
  );
});

const { value, errorMessage /*, handleBlur, handleChange*/ } = useField<
  string | null
>(fieldName, validationRules, {
  syncVModel: true,
});

const clear = () => {
  date.value = null;
  value.value = null;
};

onMounted(() => {
  sendValue();
});

const sendValue = () => {
  menu.value = false;

  emit("update:modelValue", value.value);
};

const handleClickMenu = () => {
  menu.value = true;
};

const handleUpdateDatePickerData = () => {
  if (date.value) {
    value.value = dayjs(date.value).format("YYYY-MM-DD HH:mm");
  }

  sendValue();
};
</script>

<style>
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  display: none;
}
</style>
