<template>
  <v-card
    class="mx-auto pa-4"
    flat
    elevation="0"
    rounded="lg"
    color="transparent"
  >
    <v-row dense v-if="title">
      <v-col cols="12" class="mb-4">
        <HeaderPage :title="title" :font-size="fontSize" />
      </v-col>
    </v-row>
    <v-row v-if="showCrud" dense align="center">
      <v-col cols="12" lg="10">
        <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          flat
          hide-details
          single-line
          rounded="xl"
          base-color="tooltipTextColor"
          color="tooltipTextColor"
          @update:model-value="handleSearch"
          style="font-size: 1.4rem"
          :loading="loading"
        >
          <template #prepend-inner>
            <v-icon icon="mdi-magnify" color="darkText" />
          </template>
          <template #label>
            <span class="text-darkText">
              Digite algo para efetuar consulta...
            </span>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" lg="2">
        <div class="d-flex align-center" style="gap: 0.5rem">
          <Button
            variant="outlined"
            color="grey"
            class="text-none"
            size="small"
            @click="router.back()"
          >
            <v-icon icon="mdi-arrow-left" color="darkText" />
            <span class="text-darkText text-caption"> Voltar </span>
          </Button>
          <Button
            variant="flat"
            color="primary"
            class="text-none"
            size="small"
            @click="$emit('add')"
          >
            <v-icon icon="mdi-plus" color="colorIcon" />
            <span class="text-white text-caption"> Novo </span>
          </Button>
          <slot name="button" />
        </div>
      </v-col>
    </v-row>
    <v-row align="center">
      <slot name="filters" />
    </v-row>
    <v-card-text>
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
        select-strategy="all"
        @update:model-value="$emit('update:modelValue', $event)"
        color="transparent"
        :mobile="mobile"
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
        <template v-slot:top>
          <slot name="top-table" />
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
        select-strategy="all"
        @update:model-value="$emit('update:modelValue', $event)"
        color="transparent"
        :mobile="mobile"
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
          <slot v-if="slotProps" :name="name" v-bind="slotProps" />
          <slot v-else :name="name" v-bind="slotProps" />
        </template>
      </v-data-table-virtual>
    </v-card-text>
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
  fontSize: {
    type: String,
    default: "1rem",
  },
  mobile: {
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

<!-- <style>
.v-data-table,
.v-data-table-virtual {
  background: transparent !important;
}
.v-data-table .v-data-table__wrapper,
.v-data-table-virtual .v-data-table__wrapper {
  background: transparent !important;
}
.v-data-table thead,
.v-data-table-virtual thead,
.v-data-table .v-data-table-header,
.v-data-table-virtual .v-data-table-header {
  background: transparent !important;
}

.v-data-table__th,
.v-data-table-header__th {
  background: transparent !important;
}
</style> -->
