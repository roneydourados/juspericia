<template>
  <div>
    <v-text-field
      v-model="value"
      variant="outlined"
      density="compact"
      base-color="primary"
      color="primary"
      type="date"
      :label="label"
      :error-messages="errorMessage"
      :clearable="clearable"
      :disabled="disabled"
      persistent-hint
      @click:clear="clear"
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
import moment from "moment";

import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useField } from "vee-validate";
import { textRequired } from "../utils";

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
});

const emit = defineEmits(["update:modelValue"]);

const date = ref();
const menu = ref(false);

const fieldName = computed<MaybeRef>(() => {
  return props.label;
});

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: "Data inválida",
          required_error: textRequired,
        })
        .min(10, "Data inválida")
        .refine((val) => {
          const date = new Date(val!);
          const isValid = moment(date, true).isValid();

          return isValid;
        }, "Data inválida")
    );
  }

  return toTypedSchema(
    zod
      .string({
        invalid_type_error: "Data inválida",
      })
      .optional()
      .nullish()
      .refine((val) => {
        const date = new Date(val!);
        const isValid = moment(date, true).isValid();

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
    value.value = moment(date.value).format("YYYY-MM-DD");
  }

  sendValue();
};
</script>

<style>
input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
}
</style>
