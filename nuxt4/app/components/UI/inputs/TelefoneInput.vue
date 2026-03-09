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
    rounded="xl"
    base-color="tooltipTextColor"
    color="tooltipTextColor"
  />
</template>

<script lang="ts" setup>
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useField } from "vee-validate";
import { textRequired } from "../utils";
import { uuidv7 as uuid } from "uuidv7";

const VALID_DDDS = new Set([
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19, // SP
  21,
  22,
  24, // RJ
  27,
  28, // ES
  31,
  32,
  33,
  34,
  35,
  37,
  38, // MG
  41,
  42,
  43,
  44,
  45,
  46, // PR
  47,
  48,
  49, // SC
  51,
  53,
  54,
  55, // RS
  61, // DF
  62,
  64, // GO
  63, // TO
  65,
  66, // MT
  67, // MS
  68, // AC
  69, // RO
  71,
  73,
  74,
  75,
  77, // BA
  79, // SE
  81,
  87, // PE
  82, // AL
  83, // PB
  84, // RN
  85,
  88, // CE
  86,
  89, // PI
  91,
  93,
  94, // PA
  92,
  97, // AM
  95, // RR
  96, // AP
  98,
  99, // MA
]);

const isValidBrazilianPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");

  if (digits.length !== 10 && digits.length !== 11) return false;

  // Rejeita todos os dígitos iguais
  if (/^(\d)\1+$/.test(digits)) return false;

  const ddd = parseInt(digits.substring(0, 2));
  if (!VALID_DDDS.has(ddd)) return false;

  // Celular (11 dígitos): 3º dígito deve ser 9
  if (digits.length === 11 && digits[2] !== "9") return false;

  // Fixo (10 dígitos): 3º dígito deve ser 2-5
  if (digits.length === 10) {
    const firstDigit = parseInt(digits.charAt(2));
    if (firstDigit < 2 || firstDigit > 5) return false;
  }

  return true;
};

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
  props.required ? props.label + "*" : props.label,
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
          error: textRequired,
        })
        .min(1, textRequired)
        .refine(
          (val: string) => {
            return isValidBrazilianPhone(val);
          },
          {
            message: `Telefone inválido!`,
          },
        ),
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
            return isValidBrazilianPhone(val);
          }

          return true;
        },
        {
          message: "Telefone inválido!",
        },
      ),
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
        2,
      )}) ${cleanedValue.substring(2)}`;
    }
    if (cleanedValue.length > 6) {
      cleanedValue = `${cleanedValue.substring(0, 9)}-${cleanedValue.substring(
        9,
      )}`;
    }
  } else {
    cleanedValue = `(${cleanedValue.substring(0, 2)}) ${cleanedValue.substring(
      2,
      7,
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
  },
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
