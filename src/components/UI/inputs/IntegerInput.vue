<template>
  <v-text-field
    class="inputPrice"
    v-model="value"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    type="number"
    :error-messages="errorMessage"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    @keyup.up="$event.preventDefault()"
    @keydown.up="$event.preventDefault()"
    @keyup.down="$event.preventDefault()"
    @keydown.down="$event.preventDefault()"
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
  max: {
    type: Number,
    default: 0,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

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
            message: textRequiredMin.replaceAll("$car", props.min.toString()),
          }
        )
        .refine(
          (val: string) => {
            if (props.max > 0) {
              return Number(val) <= props.max;
            }

            return true;
          },
          {
            message: `Valor máximo para este campo é de ${props.max}`,
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
          message: textRequiredMin.replaceAll("$car", props.min.toString()),
        }
      )
      .refine(
        (val: string | undefined | null) => {
          if (props.max > 0 && val) {
            return Number(val) <= props.max;
          }

          return true;
        },
        {
          message: `Valor máximo para este campo é de ${props.max}`,
        }
      )
  );
});

const { value, errorMessage } = useField<string>(fieldName, validationRules, {
  syncVModel: true,
});
</script>

<style scoped>
.inputPrice :deep(input[type="number"]) {
  -moz-appearance: textfield;
  appearance: textfield;
}

.inputPrice :deep(input::-webkit-outer-spin-button),
.inputPrice :deep(input::-webkit-inner-spin-button) {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>
