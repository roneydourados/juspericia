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
    @input="inputFormated($event.target.value)"
    @blur="blur"
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
import { isValidPhone } from "@brazilian-utils/brazilian-utils";
import { textRequired } from "../utils";
import { uuidv7 as uuid } from "uuidv7";

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
const previousValue = ref("");
const modelValue = defineModel({
  default: "",
});

// const fieldName = computed(() => {
//   return props.label || "phone";
// });

const fieldName = uuid();

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

const formatPhone = (phoneNumber: string) => {
  let cleanedValue = phoneNumber.replace(/\D/g, "");

  if (cleanedValue.length > 11) {
    cleanedValue = cleanedValue.substring(0, 11);
  }

  if (cleanedValue.length <= 10) {
    if (cleanedValue.length > 2) {
      cleanedValue = `(${cleanedValue.substring(
        0,
        2
      )}) ${cleanedValue.substring(2)}`;
    }
    if (cleanedValue.length > 6) {
      cleanedValue = `${cleanedValue.substring(0, 9)}-${cleanedValue.substring(
        9
      )}`;
    }
  } else {
    cleanedValue = `(${cleanedValue.substring(0, 2)}) ${cleanedValue.substring(
      2,
      7
    )}-${cleanedValue.substring(7)}`;
  }

  return cleanedValue;
};

const { value, errorMessage } = useField<string>(fieldName, validationRules, {
  syncVModel: true,
  initialValue: formatPhone(modelValue.value),
});

// Sincronizar valor inicial do model com o input formatado
onMounted(() => {
  if (modelValue.value) {
    inputValue.value = formatPhone(modelValue.value);
    value.value = inputValue.value.replace(/\D/g, "");
    emit("update:modelValue", value.value);
  }
});

watch(
  () => modelValue.value,
  (newValue) => {
    if (!newValue) {
      inputValue.value = "";
      value.value = "";
    } else {
      // Atualiza o campo somente se houver um novo valor
      inputValue.value = formatPhone(newValue);
      value.value = inputValue.value.replace(/\D/g, "");
    }
    emit("update:modelValue", value.value);
    // if (newValue) {
    //   inputValue.value = formatPhone(newValue);
    //   value.value = inputValue.value.replace(/\D/g, "");
    //   emit("update:modelValue", value.value);
    // }
  }
);

const inputFormated = (event: string) => {
  const newValue = event.replace(/\D/g, ""); // Remover todos os não numéricos

  // Verifica se o campo está sendo apagado (backspace ou delete)
  if (newValue.length < previousValue.value.length) {
    value.value = newValue;
    inputValue.value = event;
  } else {
    inputValue.value = formatPhone(event);
    value.value = inputValue.value.replace(/\D/g, "");
  }

  emit("update:modelValue", value.value);

  previousValue.value = event;
};

const blur = () => {
  previousValue.value = "";
};
</script>
