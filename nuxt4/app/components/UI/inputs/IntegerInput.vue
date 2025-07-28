<template>
  <v-text-field
    ref="textField"
    v-model="value"
    :label="dynamicLabel"
    :error-messages="errorMessage"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    autocomplete="section-blue one-time-code"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    @keypress="onKeyPress"
  />
</template>

<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useField } from "vee-validate";
import { uuidv7 as uuid } from "uuidv7";

const textField = ref(null);

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const modelValue = defineModel({
  default: "",
});

const fieldName = uuid(); // Gerar um ID único para o campo

const onKeyPress = (event: any) => {
  const isNumber = /^[0-9]$/;
  if (!isNumber.test(event.key)) {
    event.preventDefault();
  }
};

const validateValue = (val: string | null | undefined) => {
  if (!val) return !props.required;

  if (val.includes(" ")) return false;

  const numericVal = Number(val.trim().replaceAll(".", "").replaceAll(",", ""));
  if (isNaN(numericVal)) return false;

  if (props.min !== undefined && numericVal < props.min) return false;

  return true;
};

// Converter valor para número apenas na validação
const validationRules = computed(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: "Valor inválido",
          required_error: "Campo não pode ser vazio!",
        })
        .min(1, "Campo não pode ser vazio!")
        .refine(
          (val: string) => {
            let valid = true;

            if (valid) {
              if (val.includes(" ")) {
                valid = false;
              } else {
                valid = !isNaN(
                  Number(val.trim().replaceAll(".", "").replaceAll(",", ""))
                );
              }
            }

            if (!valid) {
              value.value = "";
            }

            return valid;
          },
          {
            message: "Valor inválido!!",
          }
        )
        .refine(validateValue, {
          message:
            props.min !== undefined
              ? `Valor deve ser maior ou igual a ${props.min}`
              : "Valor inválido!!",
        })
    );
  }

  return toTypedSchema(
    zod
      .string({
        invalid_type_error: "Valor inválido",
      })
      .nullish()
      .optional()
      .refine(
        (val: string | undefined | null) => {
          let valid = true;

          if (valid && val) {
            if (val.includes(" ")) {
              valid = false;
            } else {
              valid = !isNaN(
                Number(val.trim().replaceAll(".", "").replaceAll(",", ""))
              );
            }
          }

          if (!valid) {
            value.value = "";
          }

          return valid;
        },
        {
          message: "Valor inválido!!",
        }
      )
      .refine(validateValue, {
        message:
          props.min !== undefined
            ? `Valor deve ser maior ou igual a ${props.min}`
            : "Valor inválido!!",
      })
  );
});

const { value, errorMessage } = useField(fieldName, validationRules, {
  syncVModel: true,
  initialValue: modelValue.value,
});

const dynamicLabel = props.required ? `${props.label}*` : props.label;

// Emitir o valor como número ao invés de string
watch(value, (newValue) => {
  emit("update:modelValue", newValue === "" ? null : newValue); // Mantém string e zeros à esquerda
});
</script>
