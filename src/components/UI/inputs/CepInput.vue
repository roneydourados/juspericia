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
    :loading="loading"
    @keypress="onKeyPress"
    @input="inputFormated($event.target.value)"
    @blur="getData"
    autocomplete="section-blue one-time-code"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
  />
</template>

<script lang="ts" setup>
type CepAdderssProps = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  numero: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
};

import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useField } from "vee-validate";
import { formatCEP, isValidCEP } from "@brazilian-utils/brazilian-utils";
import { uuidv7 as uuid } from "uuidv7";

const textField = ref(null);
const fieldName = uuid();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "mdi-map-marker-radius-outline",
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
});

const emit = defineEmits(["update:modelValue", "update:modelAddress"]);

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const inputValue = ref();
const loading = ref(false);
const modelValue = defineModel({
  default: "",
});

const onKeyPress = (event: any) => {
  if (event.key < "0" || event.key > "9") {
    event.preventDefault();
  }
};

// const fieldName = computed(() => {
//   return props.label.toLowerCase() || "cep";
// });

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: "O CEP deve ser válido!",
          required_error: "O CEP deve ser válido!",
        })
        .min(1, "Campo não pode ser vazio!")
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
      .string({
        invalid_type_error: "O CEP deve ser válido!",
      })
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

const { value, errorMessage } = useField<string>(fieldName, validationRules, {
  syncVModel: true,
  initialValue: formatCEP(modelValue.value),
});

// Sincronizar valor inicial do model com o input formatado
onMounted(() => {
  if (modelValue.value) {
    inputValue.value = formatCEP(modelValue.value);
    value.value = inputValue.value.replace(/\D/g, "");
    emit("update:modelValue", value.value);
  }
});

watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue) {
      inputValue.value = formatCEP(newValue);
      value.value = inputValue.value.replace(/\D/g, "");
      emit("update:modelValue", value.value);
    }
  }
);

const inputFormated = (event: string) => {
  inputValue.value = formatCEP(event);
  value.value = inputValue.value.replace(/\D/g, "");
  emit("update:modelValue", value.value);
};

const getData = async () => {
  if (isValidCEP(value.value)) {
    loading.value = true;
    try {
      try {
        const { data } = await useFetch<CepAdderssProps>(
          "https://viacep.com.br/ws/" + value.value + "/json/"
        );

        emit("update:modelAddress", data.value);
      } catch (error) {
        console.log("🚀 ~ CEP DATA ~ error:", error);
        emit("update:modelAddress", {});
      }
    } finally {
      loading.value = false;
    }
  }
};
</script>
