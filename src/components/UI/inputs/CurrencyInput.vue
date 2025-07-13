<template>
  <v-text-field
    v-model="inputValue"
    :label="dynamicLabel"
    :placeholder="placeholder"
    :disabled="disabled"
    :type="type"
    :error-messages="errorMessage"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    @input="inputFormated($event.target.value)"
    @click:clear="clearValue"
  />
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { textRequired } from "../utils";
import { uuidv7 as uuid } from "uuidv7";

const props = defineProps({
  icon: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: "text" },
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  min: { type: Number, default: 0 },
  clearable: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const modelValue = defineModel<string | undefined>({ default: undefined });

const numeralValue = ref(0);
const inputValue = ref();
const fieldName = uuid();

const validationRules = computed<MaybeRef>(() => {
  const base = zod.string({
    invalid_type_error: textRequired,
    required_error: textRequired,
  });

  const refined = base.min(1, textRequired).refine(
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

      if (!valid) value.value = "";

      return valid;
    },
    { message: "Valor inválido!!" }
  );

  return toTypedSchema(props.required ? refined : refined.nullish().optional());
});

const { value, errorMessage } = useField<string | undefined>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
    initialValue: modelValue.value?.replaceAll(".", "").replaceAll(",", "."),
  }
);

// Formatador BRL
const amountFormated = (valueCurrency: number) => {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valueCurrency);
};

// Inicializar valor formatado no input
onMounted(() => {
  if (modelValue.value) {
    const aValue = modelValue.value.replaceAll(".", "").replaceAll(",", ".");

    if (isNaN(Number(aValue))) {
      inputValue.value = "";
      numeralValue.value = 0;
      value.value = "";
      emit("update:modelValue", "");
      return;
    }

    const aValueNumber = Number(aValue) / 100;

    inputValue.value = amountFormated(aValueNumber);
    numeralValue.value = aValueNumber;
    value.value = aValueNumber.toFixed(2);
  }
});

// Watch para atualizar quando modelValue mudar de fora
watch(
  () => modelValue.value,
  (newValue) => {
    if (!newValue || newValue.trim() === "") {
      inputValue.value = "";
      numeralValue.value = 0;
      value.value = "";
      return;
    }

    const aValue = newValue.replaceAll(".", "").replaceAll(",", ".");
    if (isNaN(Number(aValue))) {
      inputValue.value = "";
      numeralValue.value = 0;
      value.value = "";
      emit("update:modelValue", "");
      return;
    }

    inputFormated(newValue);
  }
);

// Formata valor digitado
const inputFormated = (event: string) => {
  if (!event || event.trim() === "") {
    inputValue.value = "";
    numeralValue.value = 0;
    value.value = "";
    emit("update:modelValue", "");
    return;
  }

  const asValue = event
    .replaceAll(".", "")
    .replaceAll(",", "")
    .replaceAll("R$", "")
    .trim();

  if (asValue.length >= 21) {
    inputValue.value = "";
    numeralValue.value = 0;
    value.value = "";
    emit("update:modelValue", "");
    return;
  }

  numeralValue.value = Number(asValue) / 100;

  if (numeralValue.value <= 0 || isNaN(numeralValue.value)) {
    inputValue.value = "";
    numeralValue.value = 0;
    value.value = "";
    emit("update:modelValue", "");
    return;
  }

  const formatted = amountFormated(numeralValue.value);
  inputValue.value = formatted;
  value.value = numeralValue.value.toFixed(2);
  emit("update:modelValue", numeralValue.value.toFixed(2));
};

// Limpa valor
const clearValue = () => {
  inputValue.value = "";
  numeralValue.value = 0;
  value.value = "";
  emit("update:modelValue", "");
};
</script>

<!-- <template>
  <v-text-field
    v-model="inputValue"
    :label="dynamicLabel"
    :placeholder="placeholder"
    :disabled="disabled"
    :type="type"
    :error-messages="errorMessage"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    @input="inputFormated($event.target.value)"
    @click:clear="clearValue"
  />
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { textRequired } from "../utils";
import { uuidv7 as uuid } from "uuidv7";

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
});

const emit = defineEmits(["update:modelValue"]);

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const modelValue = defineModel<string | undefined>({
  default: undefined,
});

const numeralValue = ref(0);
const inputValue = ref();
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
        invalid_type_error: textRequired,
      })
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
    initialValue: modelValue.value?.replaceAll(".", "").replaceAll(",", "."),
  }
);

// Sincronizar valor inicial do model com o input formatado
onMounted(() => {
  if (modelValue.value) {
    const aValue = modelValue.value?.replaceAll(".", "").replaceAll(",", ".");

    if (isNaN(Number(aValue))) {
      inputValue.value = "";
      numeralValue.value = 0;
      value.value = "";
      emit("update:modelValue", value.value);
      return;
    }

    const aValueNumber = Number(aValue) / 100;

    inputValue.value = amountFormated(aValueNumber);
    value.value = aValueNumber.toFixed(2);
  }
});

watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue) {
      const aValue = newValue.replaceAll(".", "").replaceAll(",", ".");
      if (isNaN(Number(aValue))) {
        inputValue.value = "";
        numeralValue.value = 0;
        value.value = "";
        emit("update:modelValue", value.value);
        return;
      }
      inputFormated(newValue);
    }
  }
);

const inputFormated = (event: string) => {
  const digitedValue = event;
  const asValue = digitedValue
    .replaceAll(".", "")
    .replaceAll(",", "")
    .replaceAll("R$", "");

  if (asValue.length >= 21) {
    inputValue.value = "";
    numeralValue.value = 0;
    value.value = "";
    emit("update:modelValue", numeralValue.value);

    return;
  }

  numeralValue.value = Number(asValue) / 100;

  if (numeralValue.value < 0) {
    inputValue.value = "";
    numeralValue.value = 0;
    value.value = "";
    emit("update:modelValue", value.value);
    return;
  }

  if (numeralValue.value > 0) {
    emit("update:modelValue", numeralValue.value.toFixed(2));
    inputValue.value = amountFormated(numeralValue.value);
    value.value = numeralValue.value.toFixed(2);
  }
};

const clearValue = () => {
  emit("update:modelValue", "");
};

const amountFormated = (valueCurrency: number) => {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valueCurrency);
};
</script> -->
