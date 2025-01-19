<template>
  <v-text-field
    ref="textField"
    v-model="inputValue"
    :label="dynamicLabel"
    :error-messages="errorMessage"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="cleareable"
    :prepend-inner-icon="icon"
    @keypress="onKeyPress"
    @input="inputFormated($event.target.value)"
    autocomplete="section-blue one-time-code"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
  />
</template>

<script lang="ts" setup>
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useField } from "vee-validate";
import { formatCNPJ, isValidCNPJ } from "@brazilian-utils/brazilian-utils";

const textField = ref(null);

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
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  cleareable: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const inputValue = ref();
const modelValue = defineModel({
  default: "",
});

const onKeyPress = (event: any) => {
  if (event.key < "0" || event.key > "9") {
    event.preventDefault();
  }
};

const fieldName = computed(() => {
  return props.label.toLowerCase() || "cnpj";
});

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: "O CNPJ deve ser válido!",
          required_error: "O CNPJ deve ser válido!",
        })
        .min(1, "Campo não pode ser vazio!")
        .refine(
          (val: string) => {
            return isValidCNPJ(val);
          },
          {
            message: "CNPJ inválido!",
          }
        )
    );
  }

  return toTypedSchema(
    zod
      .string({
        invalid_type_error: "O CNPJ deve ser válido!",
      })
      .nullish()
      .optional()
      .refine(
        (val: string | undefined | null) => {
          if (val) {
            return isValidCNPJ(val);
          }

          return true;
        },
        {
          message: "CNPJ inválido!",
        }
      )
  );
});

const { value, errorMessage } = useField<string>(fieldName, validationRules, {
  syncVModel: true,
  initialValue: formatCNPJ(modelValue.value),
});

// Sincronizar valor inicial do model com o input formatado
onMounted(() => {
  if (modelValue.value) {
    inputValue.value = formatCNPJ(modelValue.value);
    value.value = inputValue.value.replace(/\D/g, "");
    emit("update:modelValue", value.value);
  }
});

watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue) {
      inputValue.value = formatCNPJ(newValue);
      value.value = inputValue.value.replace(/\D/g, "");
      emit("update:modelValue", value.value);
    }
  }
);

const inputFormated = (event: string) => {
  inputValue.value = formatCNPJ(event);
  value.value = inputValue.value.replace(/\D/g, "");
  emit("update:modelValue", value.value);
};
</script>
