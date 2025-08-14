<template>
  <div class="d-flex flex-column">
    <AutoCompleteInput
      v-model="value"
      v-model:search="search"
      :label="label"
      placeholder="Digite algo para pesquisar..."
      item-title="profileName"
      return-object
      :required="required"
      icon="mdi-magnify"
      :items="$all"
      :loading="loadingSearch"
      @update:model-value="$emit('update:modelValue', $event)"
      @click:clear="$emit('clear')"
      :clearable="clearable"
      :disabled="disabled"
    >
      <template #item="{ item, props }">
        <v-list-item
          v-bind="props"
          :title="item.raw.profileName"
          :subtitle="item.raw.type"
          density="compact"
        >
        </v-list-item>
      </template>

      <template #selection="{ item }">
        <div class="d-flex align-center">
          <span class="ml-2 d-inline-block text-truncate">
            {{ item.raw.profileName }}
          </span>
        </div>
      </template>
    </AutoCompleteInput>

    <div v-if="showNewButton" class="mt-n3">
      <Button size="small" color="info" variant="text" @click="showForm = true">
        <v-icon icon="mdi-plus" size="22" start />
        <span class="font-weight-bold text-caption">Novo Vendedor</span>
      </Button>
    </div>
    <SellerForm :show="showForm" width="800" title="Vendedor" />
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { uuidv7 } from "uuidv7";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useDebounceFn } from "@vueuse/core";

defineProps({
  type: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Perfil",
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

const emit = defineEmits(["update:modelValue", "clear"]);

const profileSellerStore = useProfileStore();

const search = ref("");
const loadingSearch = ref(false);
const showForm = ref(false);

const $all = computed(() => profileSellerStore.$profileSellers);

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

const handleSearch = useDebounceFn(async () => {
  loadingSearch.value = true;
  try {
    await profileSellerStore.indexSellers({
      profileName: search.value,
    });
  } finally {
    loadingSearch.value = false;
  }
}, 500);
</script>
