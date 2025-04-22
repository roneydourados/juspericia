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

const textField = ref(null);

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  // modelValue: {
  //   type: String, // Alterado para String para manter os zeros à esquerda
  //   required: true,
  // },
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

const fieldName = computed(() => {
  return props.label || "integer-input";
});

const onKeyPress = (event: any) => {
  const isNumber = /^[0-9]$/;
  if (!isNumber.test(event.key)) {
    event.preventDefault();
  }
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
