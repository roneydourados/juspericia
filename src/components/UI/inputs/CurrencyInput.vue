<template>
  <v-text-field
    v-model="value"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :type="type"
    :error-messages="errorMessage"
    :variant="variant"
    :density="destiny"
    base-color="primary"
    color="primary"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    @update:model-value="sendValue"
    @click:clear="clearValue"
  />
</template>

<script setup lang="ts">
type NumperPlaces = 2 | 3 | 4;
import { v4 as uuidv4 } from "uuid";
import { useField } from "vee-validate";

import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { textRequired } from "../utils";

type InputType =
  | "underlined"
  | "filled"
  | "outlined"
  | "plain"
  | "solo"
  | "solo-inverted"
  | "solo-filled"
  | undefined;

type InputDestinyProps = "comfortable" | "compact" | "default";

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
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
  numberPlaces: {
    type: Number as PropType<NumperPlaces>,
    default: 2,
  },
  variant: {
    type: String as PropType<InputType>,
    default: "outlined",
  },
  destiny: {
    type: String as PropType<InputDestinyProps>,
    default: "compact",
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
            let valid = true;

            if (props.min > 0) {
              valid = val.length >= props.min;
            }

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
              sendValue();
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
      .string()
      .nullish()
      .optional()
      .refine(
        (val: string | undefined | null) => {
          let valid = true;

          if (props.min > 0 && val) {
            valid = val.length >= props.min;
          }

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
            sendValue();
          }

          return valid;
        },
        {
          message: "Valor inválido!!",
        }
      )
  );
});

const { value, errorMessage } = useField<string | undefined>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);

value.value = props.modelValue;

const sendValue = () => {
  if (!value.value) return;

  const { amountFormated } = useUtils();

  const asValue = value.value
    .replaceAll(".", "")
    .replaceAll(",", "")
    .replaceAll("R$", "");

  // tratar para o valor máximo ser 1 quatrilhão, já é mais que suficente
  if (asValue.length >= 21) {
    return;
  }

  // tratamento para se, digitar qualquer coisa diferente de um número, retornar vazio
  if (isNaN(Number(asValue))) {
    emit("update:modelValue", "");
    emit("update:modelNumber", 0);
    return;
  }

  // faz a divizão por 100 para já calcular o valor para usuário
  const numeralValue = Number(asValue) / 100;

  // se for um valor zerado, então retornar vazio
  if (numeralValue <= 0) {
    emit("update:modelValue", "");
    emit("update:modelNumber", 0);
    return;
  }

  // formatar o valor para um valor numeral, ou de modeda
  value.value = amountFormated(numeralValue, false).trim();

  //retornar valor formadato para input onde quer que ele seja usado
  emit("update:modelValue", value.value);
  emit("update:modelNumber", numeralValue);
};

const clearValue = () => {
  emit("update:modelValue", "");
  emit("update:modelNumber", 0);
};
</script>
