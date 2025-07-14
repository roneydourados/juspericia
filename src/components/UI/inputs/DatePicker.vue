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
    @input="handleInputAndFormat"
    @blur="validateAndEmitOnBlur"
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
              class="mt-1"
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
            :view-mode="viewMode"
            @update:model-value="handleUpdateDatePickerData"
          />
        </v-locale-provider>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
type ViewMode = "month" | "months" | "year";

import dayjs from "dayjs";
import "dayjs/locale/pt"; // Importe o locale português para dayjs
import customParseFormat from "dayjs/plugin/customParseFormat"; // Plugin para formato de data
dayjs.extend(customParseFormat);

import { v7 as uuid } from "uuid";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useField } from "vee-validate";
import { computed, ref, watch, onMounted, type PropType } from "vue"; // Importações explícitas

const props = defineProps({
  label: { type: String, default: "" },
  required: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  min: { type: Number },
  viewMode: { type: String as PropType<ViewMode>, default: "month" },
});

// USANDO DEFINE MODEL PARA O VALOR PRINCIPAL DO COMPONENTE
const modelValue = defineModel<string | null>("modelValue", {
  default: null,
  required: false, // Alterado para false: permite que o componente seja usado sem um v-model inicial
});

const date = ref<Date | null>(null);
const menu = ref(false);

const inputValue = ref(""); // Para armazenar o valor conforme o usuário digita (DD/MM/YYYY)

const fieldName = ref(uuid());

const dynamicLabel = computed(() =>
  props.required ? `${props.label}*` : props.label
);

// Regras de validação com Zod
const validationSchema = computed(() => {
  let schema: zod.ZodTypeAny;

  // A validação agora foca no formato YYYY-MM-DD que é o valor final
  // e lida com o required separadamente.
  schema = zod
    .string()
    .nullable() // Permite que o valor final seja null
    .refine((val) => {
      // Se não for obrigatório e o valor for nulo/vazio, é válido.
      if (!props.required && (val === null || val === "")) {
        return true;
      }
      // Se for obrigatório e nulo/vazio, é inválido (min(1) ou checked no schema principal do Zod)
      if (props.required && (val === null || val === "")) {
        return false;
      }
      // Se tiver valor, valida se é uma data válida no formato YYYY-MM-DD
      return dayjs(val, "YYYY-MM-DD", true).isValid();
    }, "Data inválida."); // Mensagem genérica para data inválida

  if (props.required) {
    // Para o campo obrigatório, refine() para garantir que não seja null/vazio.
    // Isso sobrepõe o .nullable() se for 'required'.
    schema = schema.refine((val) => {
      return val !== null && val !== "";
    }, "Campo não pode ser vazio!");
  }

  return toTypedSchema(schema);
});

const { value, errorMessage, meta, handleChange, handleBlur } = useField<
  string | null
>(fieldName, validationSchema, {
  initialValue: modelValue.value, // Usa o valor do defineModel como initialValue
});

// Sincroniza modelValue (YYYY-MM-DD) para inputValue (DD/MM/YYYY) na inicialização
onMounted(() => {
  if (
    modelValue.value &&
    dayjs(modelValue.value, "YYYY-MM-DD", true).isValid()
  ) {
    inputValue.value = dayjs(modelValue.value).format("DD/MM/YYYY");
    date.value = dayjs(modelValue.value).toDate();
    // Importante: Força o useField a reconhecer o valor inicial como válido
    handleChange(modelValue.value, true);
  } else {
    inputValue.value = "";
    date.value = null;
    value.value = null;
    // Força o useField a validar o estado inicial vazio/nulo
    handleChange(null, true);
  }
});

// Observa alterações em modelValue (a prop v-model) para atualizar inputValue (display)
// Isso é importante se o valor mudar via date picker ou programaticamente de fora
watch(modelValue, (newValue) => {
  // Se o valor de modelValue mudar (externamente), atualizamos inputValue
  if (newValue && dayjs(newValue, "YYYY-MM-DD", true).isValid()) {
    inputValue.value = dayjs(newValue).format("DD/MM/YYYY");
    date.value = dayjs(newValue).toDate();
  } else if (newValue === null || newValue === "") {
    inputValue.value = "";
    date.value = null;
  }
  // Chame handleChange para revalidar com o novo valor que veio do pai
  // Isso é crucial para que VeeValidate saiba que o valor mudou
  handleChange(newValue || ""); // Passe o valor final da API (YYYY-MM-DD)
});

// Centraliza a lógica de formatação e atualização ao digitar
const handleInputAndFormat = (event: Event) => {
  let inputVal = (event.target as HTMLInputElement).value;
  inputVal = inputVal.replace(/\D/g, ""); // Remove tudo que não for número

  let formatted = "";
  if (inputVal.length > 0) {
    formatted = inputVal.slice(0, 2);
    if (inputVal.length > 2) {
      formatted += "/" + inputVal.slice(2, 4);
    }
    if (inputVal.length > 4) {
      formatted += "/" + inputVal.slice(4, 8);
    }
  }

  // Limita a 10 caracteres após a formatação (DD/MM/YYYY)
  if (formatted.length > 10) {
    formatted = formatted.slice(0, 10);
  }

  inputValue.value = formatted; // Atualiza o v-model do text-field

  // Tenta converter e atualizar o valor para a API (YYYY-MM-DD)
  // O valor só é considerado completo e válido para API se tiver 10 caracteres
  if (
    formatted.length === 10 &&
    dayjs(formatted, "DD/MM/YYYY", true).isValid()
  ) {
    const formattedForApi = dayjs(formatted, "DD/MM/YYYY").format("YYYY-MM-DD");
    value.value = formattedForApi; // Atualiza o valor do useField (YYYY-MM-DD)
    modelValue.value = formattedForApi; // Atualiza o defineModel
  } else {
    // Se não for completo ou válido, o valor da API deve ser nulo/vazio
    value.value = null;
    modelValue.value = null;
  }

  // Chame o handleChange do vee-validate com o valor formatado para que a validação parcial ocorra.
  // Isso permite que o erro "Data inválida ou incompleta" apareça em tempo real.
  handleChange(inputValue.value);
};

// Função para validar e emitir a data ao desfocar o campo (blur)
const validateAndEmitOnBlur = () => {
  const inputVal = inputValue.value;

  // Se o inputVal estiver vazio e não for required, limpa e considera válido.
  if (!props.required && (!inputVal || inputVal.length === 0)) {
    value.value = null;
    modelValue.value = null;
  } else if (
    inputVal.length === 10 &&
    dayjs(inputVal, "DD/MM/YYYY", true).isValid()
  ) {
    const formattedDate = dayjs(inputVal, "DD/MM/YYYY").format("YYYY-MM-DD");
    value.value = formattedDate;
    modelValue.value = formattedDate;
  } else {
    // Se a data for inválida ou incompleta no blur, zera o valor para a API
    value.value = null;
    modelValue.value = null;
  }
  // Força a validação final no blur
  handleChange(inputValue.value, true); // Força a validação do VeeValidate com o valor atual do input
};

const handleClickMenu = () => {
  if (
    inputValue.value &&
    dayjs(inputValue.value, "DD/MM/YYYY", true).isValid()
  ) {
    date.value = dayjs(inputValue.value, "DD/MM/YYYY").toDate();
  } else if (
    modelValue.value &&
    dayjs(modelValue.value, "YYYY-MM-DD", true).isValid()
  ) {
    // Se inputValue está vazio/inválido, mas modelValue tem uma data válida da API
    // tenta usar modelValue para abrir o date picker.
    date.value = dayjs(modelValue.value).toDate();
  } else {
    date.value = null;
  }
  menu.value = true;
};

const handleUpdateDatePickerData = (newDate: Date | null) => {
  if (newDate) {
    const formattedDateForDisplay = dayjs(newDate).format("DD/MM/YYYY");
    const formattedDateForApi = dayjs(newDate).format("YYYY-MM-DD");

    inputValue.value = formattedDateForDisplay;
    value.value = formattedDateForApi;
    modelValue.value = formattedDateForApi; // Atualiza o defineModel

    menu.value = false;
  } else {
    inputValue.value = "";
    value.value = null;
    modelValue.value = null;
    menu.value = false;
  }
  handleChange(inputValue.value); // Dispara validação do vee-validate
};
</script>

<style scoped>
/* Seus estilos aqui */
</style>

<!-- <template>
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
            @update:model-value="handleUpdateDatePickerData($event)"
            @click="emit('click:day', dayjs(date).format('YYYY-MM-DD'))"
          />
        </v-locale-provider>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useField } from "vee-validate";
import { uuidv7 as uuid } from "uuidv7";

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

const emit = defineEmits(["update:modelValue", "click:day", "blur"]);

const date = ref(); // Armazena a data para o v-date-picker
const menu = ref(false);
const modelValue = defineModel({
  default: "",
});

const inputValue = ref(""); // Para armazenar o valor conforme o usuário digita

// const fieldName = computed(() => {
//   return props.label || "datepicker";
// });
const fieldName = uuid(); // Gerar um ID único para o campo
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
          const isValid = dayjs(date).isValid();
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
        if (!val) return true;

        const date = new Date(val!);
        const isValid = dayjs(date).isValid();
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
    inputValue.value = dayjs(modelValue.value, "YYYY-MM-DD").format(
      "DD/MM/YYYY"
    );
  }
});

// Observa alterações em modelValue para atualizar inputValue
watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue) {
      inputValue.value = dayjs(newValue, "YYYY-MM-DD").format("DD/MM/YYYY");
    }
  }
);

const handleClickMenu = () => {
  // Abre o menu do v-date-picker e tenta carregar a data selecionada
  if (dayjs(value.value, "YYYY-MM-DD", true).isValid()) {
    date.value = dayjs(value.value, "YYYY-MM-DD").toDate();
  } else {
    date.value = null; // Limpa a data se for inválida
  }
  menu.value = true;
};

const handleUpdateDatePickerData = (newDate: Date) => {
  if (newDate) {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    inputValue.value = dayjs(newDate).format("DD/MM/YYYY");
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
  const isValid = dayjs(textDate, "DD/MM/YYYY", true).isValid();
  if (isValid) {
    const formattedDate = dayjs(textDate, "DD/MM/YYYY").format("YYYY-MM-DD");
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
    const isValid = dayjs(inputVal, "DD/MM/YYYY", true).isValid();
    if (isValid) {
      const formattedDate = dayjs(inputVal, "DD/MM/YYYY").format("YYYY-MM-DD");
      value.value = formattedDate;
      emit("blur", formattedDate);
    } else {
      value.value = "";
      emit("update:modelValue", "");
    }
  } else {
    value.value = ""; // Limpa o valor se a data ainda não estiver completa
    emit("update:modelValue", "");
  }
};
</script> -->
