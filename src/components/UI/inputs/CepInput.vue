<template>
  <v-text-field
    v-model="value"
    :label="label"
    :placeholder="placeholder"
    :error-messages="errorMessage"
    :disabled="disabled"
    :loading="loading"
    :clearable="clearable"
    type="text"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    maxlength="14"
    :prepend-inner-icon="icon"
    @update:model-value="sendValue"
    @blur="handleBlur"
    @focus="handleFocus"
    @input="handleChange"
    @click:clear="clearValue"
  />
</template>

<script setup lang="ts">
import { uuidv7 } from "uuidv7";
import { CepAdderssProps } from "@/types/CepAddress";
import { formatCEP, isValidCEP } from "@brazilian-utils/brazilian-utils";
import { useField } from "vee-validate";

import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

import axios from "axios";
import { textRequired, textRequiredMin } from "../utils";

const $cepApi = axios.create({
  baseURL: "https://viacep.com.br/ws/",
});

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

const emit = defineEmits([
  "update:modelValue",
  "update:modelNumber",
  "update:modelAddress",
]);

const loading = ref(false);

const fieldName = computed<MaybeRef>(() => {
  return uuidv7();
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
            return isValidCEP(val);
          },
          {
            message: "CEP inválido!",
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
            return isValidCEP(val);
          }

          return true;
        },
        {
          message: "CEP inválido!",
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
    .replaceAll(".", "")
    .replaceAll("/", "")
    .replaceAll("-", "");

  emit("update:modelNumber", asValue);
  emit("update:modelValue", value.value);
};

const handleBlur = async () => {
  if (value.value) {
    const inputLabel = formatCEP(value.value);

    emit("update:modelValue", inputLabel);

    if (isValidCEP(value.value)) {
      loading.value = true;
      try {
        try {
          const address = await $cepApi.get<CepAdderssProps>(
            `${value.value}/json/`
          );

          emit("update:modelAddress", address.data);
          sendValue();
        } catch (error) {
          emit("update:modelAddress", {});
        }
      } finally {
        loading.value = false;
      }
    }
  }
};

const handleFocus = () => {
  if (value.value) {
    const asValue = value.value
      .replaceAll(".", "")
      .replaceAll("/", "")
      .replaceAll("-", "");

    emit("update:modelValue", asValue);
  }
};

const clearValue = () => {
  emit("update:modelValue", "");
};
</script>
