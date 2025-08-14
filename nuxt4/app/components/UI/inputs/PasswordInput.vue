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
    rounded="xl"
    base-color="tooltipTextColor"
    color="tooltipTextColor"
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
  return (value: string) => {
    if (props.required && (!value || value.length === 0)) {
      return "Campo não pode ser vazio!";
    }

    if (props.min && value.length < props.min) {
      return `Mínimo de ${props.min} caracteres.`;
    }

    if (props.strong) {
      if (value.length < 8) {
        return "Mínimo de 8 caracteres.";
      }
      if (!/[A-Z]/.test(value)) {
        return "A senha deve conter pelo menos uma letra maiúscula.";
      }
      if (!/[0-9]/.test(value)) {
        return "A senha deve conter pelo menos um número.";
      }
      if (!/[^A-Za-z0-9]/.test(value)) {
        return "A senha deve conter pelo menos um caractere especial (!@&$).";
      }
    }

    return true;
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
