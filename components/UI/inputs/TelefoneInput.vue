<template>
  <v-text-field
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
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    @blur="handleBlur"
    @input="handleChange"
    @update:model-value="sendValue"
    @focus="handleFocus"
    @click:clear="clearValue"
  />
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { isValidPhone } from "@brazilian-utils/brazilian-utils";
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
});

const emit = defineEmits(["update:modelValue", "update:modelNumber"]);

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
            return isValidPhone(val);
          },
          {
            message: `Telefone inválido!`,
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
          if (val) {
            return isValidPhone(val);
          }

          return true;
        },
        {
          message: "Telefone inválido!",
        }
      )
  );
});

const { value, errorMessage, handleChange } = useField<string>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);

const sendValue = () => {
  if (!value.value) return;

  const asValue = value.value
    .replaceAll("-", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll(" ", "");

  emit("update:modelNumber", asValue);
  emit("update:modelValue", asValue);
};

const handleBlur = () => {
  if (value.value) {
    const { formatTelephoneNumber } = useUtils();
    const inputLabel = formatTelephoneNumber(value.value);

    emit("update:modelValue", inputLabel);
  }
};

const handleFocus = () => {
  if (value.value) {
    const asValue = value.value
      .replaceAll("-", "")
      .replaceAll("(", "")
      .replaceAll(")", "")
      .replaceAll(" ", "");

    emit("update:modelValue", asValue);
  }
};

const clearValue = () => {
  emit("update:modelValue", "");
  emit("update:modelNumber", "");
};
</script>
