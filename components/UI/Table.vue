<template>
  <v-card max-height="550" :width="width">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-data-table
        v-model:page="page"
        :headers="headers"
        :items="items"
        :search="search"
        :items-per-page="itemsPerPage"
        no-data-text="Nenhum dado encontrado"
      >
        <!--
          Aqui vem os slotes que são enviados para componente
          Referente a itens, pode ser n itens
        -->
        <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
          <slot v-if="slotProps" :name="name" v-bind="slotProps" />
          <slot v-else :name="name" v-bind="slotProps" />
        </template>

        <template v-slot:top>
          <v-row dense align="center">
            <v-col cols="12" lg="10">
              <v-text-field
                v-model="search"
                density="compact"
                label="Pesquisar..."
                prepend-inner-icon="mdi-magnify"
                variant="solo-filled"
                flat
                hide-details
                single-line
                rounded="lg"
                @update:model-value="$emit('search', search)"
              />
            </v-col>
            <v-col cols="12" lg="2">
              <div class="d-flex align-center" style="gap: 0.5rem">
                <v-btn
                  variant="flat"
                  color="success"
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
            />
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
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
  width: {
    type: String,
    default: "80%",
  },
  title: {
    type: String,
    default: "Tabela",
  },
});

defineEmits(["search", "add"]);

const pageCount = computed(() => {
  return Math.ceil(props.items.length / props.itemsPerPage);
});

const search = ref("");
const page = ref(1);
</script>
