<template>
  <v-text-field
    v-model="inputValue"
    :label="dynamicLabel"
    :error-messages="errorMessage"
    :clearable="clearable"
    :disabled="disabled"
    persistent-hint
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    maxlength="10"
    @input="formatDateOnInput"
    @blur="validateDateOnBlur"
  >
    <template v-slot:prepend-inner>
      <v-menu v-model="menu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            icon
            size="x-small"
            v-bind="props"
            @click="handleClickMenu"
          >
            <v-icon
              icon="mdi-calendar-multiselect-outline"
              size="20"
              color="primary"
            />
          </v-btn>
        </template>
        <v-locale-provider locale="pt">
          <v-date-picker
            v-model="date"
            elevation="8"
            rounded="lg"
            hide-actions
            hide-title
            hide-header
            color="primary"
            @update:model-value="handleUpdateDatePickerData"
          />
        </v-locale-provider>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import moment from "moment";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useField } from "vee-validate";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
  },
});

const emit = defineEmits(["update:modelValue"]);

const date = ref(); // Armazena a data para o v-date-picker
const menu = ref(false);
const modelValue = defineModel({
  default: "",
});

const inputValue = ref(""); // Para armazenar o valor conforme o usuário digita

const fieldName = computed(() => {
  return props.label || "datepicker";
});

const dynamicLabel = computed(() =>
  props.required ? `${props.label}*` : props.label
);

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: "Data inválida",
          required_error: "Campo não pode ser vazio!",
        })
        .min(10, "Campo não pode ser vazio!")
        .refine((val) => {
          const date = new Date(val!);
          const isValid = moment(date, true).isValid();
          return isValid;
        }, "Data inválida")
    );
  }

  return toTypedSchema(
    zod
      .string({
        invalid_type_error: "Data inválida",
      })
      .optional()
      .nullish()
      .refine((val) => {
        const date = new Date(val!);
        const isValid = moment(date, true).isValid();
        return isValid;
      }, "Data inválida")
  );
});

const { value, errorMessage } = useField<string>(fieldName, validationRules, {
  syncVModel: true,
  initialValue: modelValue.value,
});

// Sincroniza o valor inicial do modelValue com o inputValue
onMounted(() => {
  if (modelValue.value) {
    inputValue.value = moment(modelValue.value, "YYYY-MM-DD").format(
      "DD/MM/YYYY"
    );
  }
});

// Observa alterações em modelValue para atualizar inputValue
watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue) {
      inputValue.value = moment(newValue, "YYYY-MM-DD").format("DD/MM/YYYY");
    }
  }
);

const handleClickMenu = () => {
  // Abre o menu do v-date-picker e tenta carregar a data selecionada
  if (moment(value.value, "YYYY-MM-DD", true).isValid()) {
    date.value = moment(value.value, "YYYY-MM-DD").toDate();
  } else {
    date.value = null; // Limpa a data se for inválida
  }
  menu.value = true;
};

const handleUpdateDatePickerData = (newDate: Date) => {
  if (newDate) {
    const formattedDate = moment(newDate).format("YYYY-MM-DD");
    inputValue.value = moment(newDate).format("DD/MM/YYYY");
    value.value = formattedDate;
    emit("update:modelValue", formattedDate);
    menu.value = false; // Fecha o menu
  }
};

// Função para formatar a data conforme o usuário digita
const formatDateOnInput = (event: any) => {
  let inputVal = event.target.value.replace(/\D/g, ""); // Remove tudo que não for número

  if (inputVal.length <= 2) {
    event.target.value = inputVal; // Dia
  } else if (inputVal.length <= 4) {
    event.target.value = inputVal.slice(0, 2) + "/" + inputVal.slice(2); // Dia/Mês
  } else {
    event.target.value =
      inputVal.slice(0, 2) +
      "/" +
      inputVal.slice(2, 4) +
      "/" +
      inputVal.slice(4, 8); // Dia/Mês/Ano
  }

  inputValue.value = event.target.value;

  setValidDateApi(inputValue.value);
};

const setValidDateApi = (textDate: string) => {
  const isValid = moment(textDate, "DD/MM/YYYY", true).isValid();
  if (isValid) {
    const formattedDate = moment(textDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    value.value = formattedDate;
    emit("update:modelValue", formattedDate);
  } else {
    value.value = "";
    emit("update:modelValue", "");
  }
};

// Função para validar a data ao desfocar o campo (blur)
const validateDateOnBlur = (event: any) => {
  const inputVal = event.target.value;

  // Somente valida se a data estiver completa (10 caracteres)
  if (inputVal.length === 10) {
    const isValid = moment(inputVal, "DD/MM/YYYY", true).isValid();
    if (isValid) {
      const formattedDate = moment(inputVal, "DD/MM/YYYY").format("YYYY-MM-DD");
      value.value = formattedDate;
      emit("update:modelValue", formattedDate);
    } else {
      value.value = "";
      emit("update:modelValue", "");
    }
  } else {
    value.value = ""; // Limpa o valor se a data ainda não estiver completa
    emit("update:modelValue", "");
  }
};
</script>
