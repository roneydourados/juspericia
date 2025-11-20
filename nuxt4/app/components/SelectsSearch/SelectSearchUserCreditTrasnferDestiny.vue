<template>
  <AutoCompleteInput
    v-model="model"
    v-model:search="search"
    :label="label"
    placeholder="Digite algo para pesquisar..."
    item-title="description"
    item-value="id"
    return-object
    :required="required"
    icon="mdi-magnify"
    :items="$all"
    :loading="loadingSearch"
    @click:clear="$emit('clear')"
    :clearable="clearable"
    :disabled="disabled"
  >
    <template #item="{ item, props }">
      <v-list-item
        v-bind="props"
        :title="item.raw.description"
        :subtitle="`Saldo: ${amountFormated(
          Number(item.raw.salt ?? '0'),
          true
        )}`"
        density="compact"
      />
    </template>

    <template #selection="{ item }">
      <div class="d-flex align-center">
        <span class="ml-2 d-inline-block text-truncate">
          {{ item.raw.description }}
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

// Props
const props = defineProps({
  type: { type: String, default: "" },
  label: { type: String, default: "Saldo destino" },
  cleareable: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clientId: { type: Number, default: 0 },
  publicIdExclude: { type: String, default: "" },
});

// Emits
const emit = defineEmits(["clear"]);

// Model binding (substitui v-model e update:modelValue)
const model = defineModel<Object>();

// Stores & utils
const saltCredit = useUserCreditSaltStore();
const { amountFormated } = useUtils();

// Reactive state
const search = ref("");
const loadingSearch = ref(false);

// Dados computados
const $all = computed(() => saltCredit.$credits?.credits || []);

// Watch e lifecycle
watch(search, async () => {
  await handleSearch();
});

onMounted(async () => {
  await handleSearch();
});

// VeeValidate
const fieldName = computed<MaybeRef>(() => uuidv7());
const validationRules = computed<MaybeRef>(() =>
  toTypedSchema(zod.object({}).nullish().optional())
);
const { value } = useField<Object>(fieldName, validationRules, {
  syncVModel: true,
});

// Busca
const handleSearch = async () => {
  loadingSearch.value = true;
  try {
    await saltCredit.indexAdmin({
      isSalt: true,
      publicIdExclude: props.publicIdExclude,
      status: "CONFIRMED",
      userId: props.clientId,
    });
  } finally {
    loadingSearch.value = false;
  }
};
</script>
