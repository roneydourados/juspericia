<template>
  <v-text-field
    v-model="value"
    :label="label"
    :placeholder="placeholder"
    :error-messages="errorMessage"
    :disabled="disabled"
    :clearable="clearable"
    type="time"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    :prepend-inner-icon="icon"
  />
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { textRequired } from "../utils";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
  },
  required: {
    type: Boolean,
    default: false,
  },
  // name: {
  //   type: String,
  //   required: true,
  // },
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:modelValue", "update:modelNumber"]);

const fieldName = computed<MaybeRef>(() => {
  return props.label;
});

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: textRequired,
          required_error: textRequired,
        })
        .min(1, textRequired)
    );
  }

  return toTypedSchema(zod.string().nullish().optional());
});

const { value, errorMessage, handleChange } = useField<string>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);
</script>
