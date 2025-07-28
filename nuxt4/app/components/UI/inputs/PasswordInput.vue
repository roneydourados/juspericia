<template>
  <v-text-field
    v-model="value"
    :label="dynamicLabel"
    :placeholder="placeholder"
    :disabled="disabled"
    :type="showPassword ? 'text' : 'password'"
    :error-messages="errorMessage"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    :maxlength="maxlength"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    @blur="handleBlur"
    @input="handleChange"
    @click:append-inner="showPassword = !showPassword"
  />
</template>

<script lang="ts" setup>
import { z } from "zod";
import { uuidv7 } from "uuidv7";
import { useField } from "vee-validate";

const props = defineProps({
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
  clearable: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: Number,
    default: 255,
  },
  strong: {
    type: Boolean,
    default: false,
  },
});

const modelValue = defineModel({
  default: "",
});

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const showPassword = ref(false);
const fieldName = uuidv7();

const validationRules = computed(() => {
  let schema = z.string();

  if (props.required) {
    schema = schema.min(1, "Campo não pode ser vazio!");
  }

  if (props.min) {
    schema = schema.min(props.min, `Mínimo de ${props.min} caracteres.`);
  }

  if (props.strong) {
    schema = schema
      .min(8, "Mínimo de 8 caracteres.")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
      .regex(
        /[^A-Za-z0-9]/,
        "A senha deve conter pelo menos um caractere especial (!@&$)."
      );
  }

  return (value: string) => {
    const result = schema.safeParse(value);
    return result.success ? true : result.error.errors[0].message;
  };
});

const { value, errorMessage, handleBlur, handleChange } = useField<string>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
    initialValue: modelValue.value,
  }
);
</script>
