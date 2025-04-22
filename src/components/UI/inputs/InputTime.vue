<template>
  <v-text-field
    v-model="value"
    :label="dynamicLabel"
    :placeholder="placeholder"
    :disabled="disabled"
    type="time"
    :error-messages="errorMessage"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    :maxlength="maxlength"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    @blur="handleBlur"
    @input="handleChange"
  />
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { textRequired } from "../utils";
import moment from "moment";
import { uuidv7 as uuid } from "uuidv7";

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
});

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const fieldName = uuid();

// const fieldName = computed<MaybeRef>(() => {
//   return props.label || "input-time";
// });

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
              return moment(val, "HH:mm", true).isValid();
            }

            return true;
          },
          {
            message: "Hora inválida!",
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
            return moment(val, "HH:mm", true).isValid();
          }

          return true;
        },
        {
          message: "Hora inválida!",
        }
      )
  );
});

const { value, errorMessage, handleBlur, handleChange } = useField<string>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
    initialValue: props.modelValue,
  }
);
</script>
