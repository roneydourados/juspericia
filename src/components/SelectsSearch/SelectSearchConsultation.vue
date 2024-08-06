<template>
  <AutoCompleteInput
    v-model="value"
    v-model:search="search"
    :label="label"
    placeholder="Digite algo para pesquisar..."
    item-title="name"
    return-object
    :required="required"
    icon="mdi-magnify"
    :items="$all"
    :loading="loadingSearch"
    @click="search = ''"
    @update:model-value="$emit('update:modelValue', $event)"
    :clearable="clearable"
    :disabled="disabled"
  >
    <template #items="{ item, props }">
      <v-list-item
        v-bind="props"
        :title="item.raw.consultationName"
        :subtitle="amountFormated(item.raw.value ?? 0, true)"
        density="compact"
      >
      </v-list-item>
    </template>

    <template #selection="{ item }">
      <div class="d-flex align-center">
        <span class="ml-2 d-inline-block text-truncate">
          {{ item.raw.consultationName }}
        </span>
      </div>
    </template>
  </AutoCompleteInput>

  <div v-if="showNewButton" cols="12" lg="2">
    <v-tooltip text="Novo" content-class="tooltip-background">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-plus"
          size="x-small"
          color="info"
          flat
        />
      </template>
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { v4 as uuidv4 } from "uuid";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

defineProps({
  type: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Tipo de consulta",
  },
  modelValue: {
    type: Object,
    default: undefined,
  },
  cleareable: {
    type: Boolean,
    default: false,
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
  clientId: {
    type: Number,
    default: 0,
  },
  showNewButton: {
    type: Boolean,
    default: false,
  },
});

const { amountFormated } = useUtils();

const emit = defineEmits(["update:modelValue"]);

const consultation = useConsultationStore();

const search = ref("");
const loadingSearch = ref(false);

const $all = computed(() => consultation.$all);

watch(search, async () => {
  setTimeout(async () => {
    loadingSearch.value = true;
    try {
      await consultation.index(search.value);
    } finally {
      loadingSearch.value = false;
    }
  }, 700);
});

const fieldName = computed<MaybeRef>(() => {
  return uuidv4();
});

const validationRules = computed<MaybeRef>(() => {
  return toTypedSchema(zod.object({}).nullish().optional());
});

const { value } = useField<Object>(fieldName, validationRules, {
  syncVModel: true,
});
</script>
