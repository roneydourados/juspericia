<template>
  <v-card class="mx-auto" :max-height="!mobile ? '550' : ''" flat>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-data-table
        v-if="!mobile"
        v-model:page="page"
        :headers="headers"
        :items="items"
        :search="search"
        :items-per-page="itemsPerPage"
        no-data-text="Nenhum dado encontrado"
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
          <slot v-if="slotProps" :name="name" v-bind="slotProps" />
          <slot v-else :name="name" v-bind="slotProps" />
        </template>

        <template v-slot:top="{ items }">
          <v-row dense align="center">
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
                @update:model-value="handleSearch(Array.from(items))"
                style="font-size: 1.4rem"
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
        </template>
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination
              v-model="page"
              :length="pageCount"
              rounded="circle"
              color="primary"
              density="comfortable"
            />
          </div>
        </template>
      </v-data-table>

      <v-window v-else touch v-model="page" direction="vertical">
        <v-window-item :value="page">
          <template v-for="(item, index) in slicedItems">
            <v-card flat rounded="lg">
              <v-card-text>
                <slot name="mobileContent" v-bind="{ item, index }" />
              </v-card-text>
              <v-card-actions class="d-flex align-center justify-end w-100">
                <slot name="mobileActions" v-bind="{ item, index }" />
              </v-card-actions>
            </v-card>
          </template>
        </v-window-item>
        <v-pagination
          v-model="page"
          :length="pageCount"
          rounded="circle"
          color="primary"
          density="compact"
        />
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = defineProps({
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
});

const emit = defineEmits(["search", "add"]);

const { mobile } = useDisplay();

const pageCount = computed(() => {
  return Math.ceil(props.items.length / props.itemsPerPage);
});

const slicedItems = computed(() => {
  const startIndex = (page.value - 1) * props.itemsPerPage;
  return props.items.slice(startIndex, startIndex + props.itemsPerPage);
});

const search = ref("");
const page = ref(1);

const handleSearch = (items: unknown[]) => {
  // somente emitir o evento de busca se não houver itens na tabela, ai sim executar a busca na api
  if (items.length <= 1) {
    emit("search", search.value);
  }
};
</script>
