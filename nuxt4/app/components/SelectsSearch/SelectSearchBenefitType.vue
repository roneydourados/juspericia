<template>
  <div class="d-flex" style="gap: 0.5rem">
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
      <template #item="{ item, props }">
        <v-list-item v-bind="props" :title="item.raw.name" density="compact">
          <!-- <template #append>
            <v-btn
              v-if="$currentUser?.profile?.type === 'ADMIN'"
              icon="mdi-pencil"
              variant="text"
              color="warning"
              @click="getEditItem(item.raw)"
            ></v-btn>
          </template> -->
        </v-list-item>
      </template>

      <template #selection="{ item }">
        <div class="d-flex align-center">
          <span class="ml-2 d-inline-block text-truncate">
            {{ item.raw.name }}
          </span>
        </div>
      </template>
    </AutoCompleteInput>

    <div v-if="showNewButton && $currentUser?.profile?.type === 'ADMIN'">
      <v-tooltip text="Novo" content-class="tooltip-background">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-plus"
            size="x-small"
            color="info"
            flat
            @click="showForm = true"
          />
        </template>
      </v-tooltip>
    </div>
  </div>
  <BenefitTypeForm
    title="Tipo de benefício"
    :show="showForm"
    :data="selected"
    @close="handleClose"
    width="400"
  />
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { uuidv7 } from "uuidv7";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { BenefitTypeProps } from "@/app/types/BenefitType";
import { useDebounceFn } from "@vueuse/core";

defineProps({
  type: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Tipo de benefício",
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

const benefitType = useBenefitTypeStore();
const auth = useAuthStore();
const selected = ref<BenefitTypeProps>();
const showForm = ref(false);

const search = ref("");
const loadingSearch = ref(false);

const $all = computed(() => benefitType.$all);
const $currentUser = computed(() => auth.$currentUser);

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

const getEditItem = (item: BenefitTypeProps) => {
  selected.value = item;
  showForm.value = true;
};

const handleClose = () => {
  showForm.value = false;
  selected.value = undefined;
};

const handleSearch = useDebounceFn(async () => {
  loadingSearch.value = true;
  try {
    await benefitType.index(search.value);
  } finally {
    loadingSearch.value = false;
  }
}, 500);
</script>
