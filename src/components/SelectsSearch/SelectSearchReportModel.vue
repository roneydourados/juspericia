<template>
  <AutoCompleteInput
    v-model="value"
    v-model:search="search"
    :label="label"
    placeholder="Digite algo para pesquisar..."
    item-title="name"
    item-value="id"
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
      <v-list-item v-bind="props" :title="item.raw.title" density="compact">
      </v-list-item>
    </template>

    <template #selection="{ item }">
      <div class="d-flex align-center">
        <span class="ml-2 d-inline-block text-truncate">
          {{ item.raw.title }}
        </span>
      </div>
    </template>
  </AutoCompleteInput>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { uuidv7 } from "uuidv7";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

defineProps({
  type: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Modelo de laudo",
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

const emit = defineEmits(["update:modelValue"]);

const reportModel = useReportModelStore();

const search = ref("");
const loadingSearch = ref(false);
const $all = computed(() => reportModel.$all);

watch(search, async () => {
  await handleSearch();
});

onMounted(async () => {
  await handleSearch();
});

const fieldName = computed<MaybeRef>(() => {
  return uuidv7();
});

const validationRules = computed<MaybeRef>(() => {
  return toTypedSchema(zod.object({}).nullish().optional());
});

const { value } = useField<Object>(fieldName, validationRules, {
  syncVModel: true,
});

const handleSearch = async () => {
  setTimeout(async () => {
    loadingSearch.value = true;
    try {
      await reportModel.index(search.value);
    } finally {
      loadingSearch.value = false;
    }
  }, 700);
};
</script>
