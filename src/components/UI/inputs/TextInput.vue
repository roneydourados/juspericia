<template>
  <v-textarea
    v-model="value"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :type="type"
    :error-messages="errorMessage"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    :maxlength="maxlength"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    :rows="rows"
    :counter="counter"
    no-resize
    @blur="handleBlur"
    @input="handleChange"
  />
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { useField } from "vee-validate";

import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

import { textRequired, textRequiredMin } from "../utils";

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
  min: {
    type: Number,
    default: 0,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: Number,
    default: 255,
  },
  rows: {
    type: String,
    default: "3",
  },
  counter: {
    type: Number,
    default: true,
  },
});

const fieldName = computed<MaybeRef>(() => {
  return uuidv4();
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
        .refine(
          (val: string) => {
            if (props.min > 0) {
              return val.length >= props.min;
            }

            return true;
          },
          {
            message: `Campo deve ter no mínimo ${props.min} caracteres!`,
          }
        )
    );
  }

  return toTypedSchema(
    zod
      .string()
      .nullish()
      .optional()
      .refine(
        (val: string | undefined | null) => {
          if (props.min > 0 && val) {
            return val.length >= props.min;
          }

          return true;
        },
        {
          message: `Campo deve ter no mínimo ${props.min} caracteres!`,
        }
      )
  );
});

const { value, errorMessage, handleBlur, handleChange } = useField(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);
</script>
