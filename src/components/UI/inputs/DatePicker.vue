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
import { computed, ref, watch, onMounted } from "vue"; // Importações explícitas

const props = defineProps({
  label: { type: String, default: "" },
  required: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  modelValue: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  min: { type: Number }, // Não usado no momento, mas boa prática
  viewMode: { type: String as PropType<ViewMode>, default: "month" },
  // Removendo props de grid (xs, sm, md, lg, xl, xxl) se não forem usadas pelo componente diretamente
});

const emit = defineEmits(["update:modelValue"]);

const date = ref<Date | null>(null); // Pode ser Date ou null
const menu = ref(false);

// Remova defineModel aqui, pois você já tem props.modelValue e emit
// const modelValue = defineModel({ default: "" });

// inputValue é o que o usuário digita/vê no v-text-field (DD/MM/YYYY)
const inputValue = ref("");

// useField gerencia o estado de validação e o valor interno (YYYY-MM-DD para a API)
const fieldName = ref(uuid()); // Use ref para fieldName se ele precisa ser reativo ou um UUID persistente

const dynamicLabel = computed(() =>
  props.required ? `${props.label}*` : props.label
);

// Regras de validação com Zod
const validationSchema = computed(() => {
  let schema: zod.ZodTypeAny;

  if (props.required) {
    schema = zod
      .string()
      .min(1, "Campo não pode ser vazio!")
      .refine((val) => {
        // Valida apenas se tiver 10 caracteres e for uma data válida no formato DD/MM/YYYY
        return val.length === 10 && dayjs(val, "DD/MM/YYYY", true).isValid();
      }, "Data inválida ou incompleta.");
  } else {
    schema = zod
      .string()
      .refine((val) => {
        // Permite vazio ou nulo se não for obrigatório
        if (!val || val.length === 0) return true;
        return val.length === 10 && dayjs(val, "DD/MM/YYYY", true).isValid();
      }, "Data inválida ou incompleta.")
      .optional()
      .nullish();
  }
  return toTypedSchema(schema);
});

// useField agora usa inputValue para o campo de entrada
const { value, errorMessage, meta, handleChange, handleBlur } =
  useField<string>(fieldName, validationSchema, {
    // Use `modelValue` do `props` para o valor inicial
    initialValue: props.modelValue,
    // `syncVModel: true` NÃO é mais necessário aqui se você gerencia o v-model manualmente
    // e o `value` de useField se torna o valor YYYY-MM-DD
  });

// Sincroniza props.modelValue (YYYY-MM-DD) para inputValue (DD/MM/YYYY) na inicialização
onMounted(() => {
  if (
    props.modelValue &&
    dayjs(props.modelValue, "YYYY-MM-DD", true).isValid()
  ) {
    inputValue.value = dayjs(props.modelValue).format("DD/MM/YYYY");
    date.value = dayjs(props.modelValue).toDate(); // Também atualiza o date picker
  } else {
    // Se o modelValue inicial for inválido ou vazio, limpa tudo
    inputValue.value = "";
    date.value = null;
    value.value = ""; // Limpa o valor do useField
  }
});

// Observa alterações em value (YYYY-MM-DD) para atualizar inputValue (DD/MM/YYYY)
// Isso é importante se o valor mudar via date picker ou programaticamente
watch(value, (newValue) => {
  if (newValue && dayjs(newValue, "YYYY-MM-DD", true).isValid()) {
    inputValue.value = dayjs(newValue).format("DD/MM/YYYY");
  } else {
    // Não limpa o inputValue aqui para permitir que o usuário digite.
    // O campo de texto deve ser limpo apenas quando o modelValue for explicitamente limpo.
    // Se newValue for "", queremos que o input fique vazio.
    if (newValue === "") {
      inputValue.value = "";
    }
  }
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

  // Tenta validar e emitir para o pai (YYYY-MM-DD)
  // Fazemos isso aqui para dar feedback imediato enquanto o usuário digita
  const isValidPartialDate = dayjs(
    inputValue.value,
    "DD/MM/YYYY",
    true
  ).isValid();
  if (inputValue.value.length === 10 && isValidPartialDate) {
    const formattedForApi = dayjs(inputValue.value, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    value.value = formattedForApi; // Atualiza o valor do useField (YYYY-MM-DD)
    emit("update:modelValue", formattedForApi); // Emite para o pai
  } else {
    // Se não for uma data completa e válida, limpa o valor da API
    // (mas mantém o inputValue para o usuário continuar digitando)
    value.value = ""; // Isso pode acionar o errorMessage
    emit("update:modelValue", "");
  }

  // Chame o handleChange do vee-validate para re-validar a entrada
  handleChange(inputValue.value); // Passa o valor formatado para o vee-validate
};

// Função para validar e emitir a data ao desfocar o campo (blur)
const validateAndEmitOnBlur = () => {
  // Use o valor final de inputValue para a validação no blur
  const inputVal = inputValue.value;

  // Se o campo estiver vazio e não for obrigatório, ele é válido.
  if (!props.required && (!inputVal || inputVal.length === 0)) {
    value.value = ""; // Zera o valor para a API
    emit("update:modelValue", "");
    handleChange("", true); // Força a validação no blur, passando o valor final
    return;
  }

  // Se a data estiver completa, tente formatar e validar
  if (inputVal.length === 10) {
    const isValid = dayjs(inputVal, "DD/MM/YYYY", true).isValid();
    if (isValid) {
      const formattedDate = dayjs(inputVal, "DD/MM/YYYY").format("YYYY-MM-DD");
      value.value = formattedDate; // Atualiza o valor do useField (YYYY-MM-DD)
      emit("update:modelValue", formattedDate); // Emite para o pai
    } else {
      value.value = ""; // Se for inválido, limpa o valor da API
      emit("update:modelValue", "");
    }
  } else {
    // Se a data não estiver completa e válida, limpa o valor da API
    value.value = "";
    emit("update:modelValue", "");
  }
  // Força a validação final no blur
  handleChange(inputVal, true); // Força a validação
};

const handleClickMenu = () => {
  // Ao abrir o menu, tenta carregar a data do inputValue formatado (DD/MM/YYYY)
  if (
    inputValue.value &&
    dayjs(inputValue.value, "DD/MM/YYYY", true).isValid()
  ) {
    date.value = dayjs(inputValue.value, "DD/MM/YYYY").toDate();
  } else {
    date.value = null; // Limpa a data se for inválida ou vazia
  }
  menu.value = true;
};

const handleUpdateDatePickerData = (newDate: Date | null) => {
  if (newDate) {
    const formattedDateForDisplay = dayjs(newDate).format("DD/MM/YYYY");
    const formattedDateForApi = dayjs(newDate).format("YYYY-MM-DD");

    inputValue.value = formattedDateForDisplay; // Atualiza o campo de texto
    value.value = formattedDateForApi; // Atualiza o valor do useField
    emit("update:modelValue", formattedDateForApi); // Emite para o pai

    menu.value = false; // Fecha o menu
  } else {
    // Se o date picker for limpo
    inputValue.value = "";
    value.value = "";
    emit("update:modelValue", "");
    menu.value = false;
  }
  // Chame o handleChange para re-validar o campo selecionado no date picker
  handleChange(inputValue.value);
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
