<template>
  <v-card class="mx-auto pa-4" flat elevation="0" rounded="lg">
    <v-row dense v-if="title">
      <v-col cols="12">
        <HeaderPage :title="title" />
      </v-col>
    </v-row>
    <v-row v-if="showCrud" dense align="center">
      <v-col cols="12" lg="10">
        <v-text-field
          v-model="search"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
          rounded="lg"
          @update:model-value="handleSearch"
          style="font-size: 1.4rem"
          :loading="loading"
        >
          <template #label>
            <span> Digite algo para efetuar consulta... </span>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" lg="2">
        <div class="d-flex align-center" style="gap: 0.5rem">
          <v-btn
            variant="flat"
            color="info"
            class="text-none"
            size="small"
            @click="router.back()"
          >
            <v-icon icon="mdi-arrow-left"> </v-icon>
            Voltar
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="text-none"
            size="small"
            @click="$emit('add')"
          >
            <v-icon icon="mdi-plus"> </v-icon>
            Novo
          </v-btn>
          <slot name="button" />
        </div>
      </v-col>
    </v-row>
    <v-row align="center">
      <slot name="filters" />
    </v-row>

    <v-data-table
      v-if="!isVirtual"
      v-model="value"
      v-model:page="page"
      :item-value="itemValue"
      :headers="headers"
      :items="items"
      :items-per-page="itemsPerPage"
      :show-select="showSelect"
      return-object
      :loading="loading"
      sticky
      fixed-header
      :hide-default-header="hideDfaultHeader"
      no-data-text="Nenhum dado encontrado"
      loading-text="Buscando dados aguarde..."
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
        <slot v-if="slotProps" :name="name" v-bind="slotProps" />
        <slot v-else :name="name" v-bind="slotProps" />
      </template>

      <template v-slot:bottom>
        <v-pagination
          v-model="page"
          :length="pageCount"
          rounded="circle"
          color="primary"
          density="comfortable"
        />
      </template>
    </v-data-table>
    <v-data-table-virtual
      v-else
      v-model="value"
      :item-value="itemValue"
      :headers="headers"
      :items="items"
      no-data-text="Nenhum dado encontrado"
      :show-select="showSelect"
      :hide-default-header="hideDfaultHeader"
      return-object
      :height="`${mobile ? '' : height}`"
      fixed-header
      sticky
      :loading="loading"
      loading-text="Buscando dados aguarde..."
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
        <slot v-if="slotProps" :name="name" v-bind="slotProps" />
        <slot v-else :name="name" v-bind="slotProps" />
      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { uuidv7 } from "uuidv7";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  hideDfaultHeader: {
    type: Boolean,
    default: false,
  },
  headers: {
    type: Array as PropType<{ title: string; key: string }[]>,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
  itemsPerPage: {
    type: Number,
    default: 6,
  },
  title: {
    type: String,
    default: "Tabela",
  },
  showCrud: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: String,
    default: "550",
  },
  height: {
    type: String,
    default: "550",
  },
  showSelect: {
    type: Boolean,
    default: false,
  },
  itemValue: {
    type: String,
    default: undefined,
  },
  ignoreMobile: {
    type: Boolean,
    default: true,
  },
  isVirtual: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const { mobile } = useDisplay();
const emit = defineEmits(["search", "add", "update:modelValue"]);
const router = useRouter();

const search = ref("");
const page = ref(1);

const handleSearch = () => {
  emit("search", search.value);
};

const pageCount = computed(() => {
  return Math.ceil(props.items.length / props.itemsPerPage);
});

const fieldName = computed<MaybeRef>(() => {
  return uuidv7();
});

const validationRules = computed<MaybeRef>(() => {
  return toTypedSchema(zod.array(zod.any()).nullish().optional());
});

const { value } = useField(fieldName, validationRules, {
  syncVModel: true,
});
</script>
