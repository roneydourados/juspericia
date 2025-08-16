<template>
  <v-tabs
    v-model="tab"
    :grow="mobile"
    :align-tabs="alignTabs"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-tab
      v-for="(tabitem, index) in tabs"
      :value="index + 1"
      :key="index"
      class="text-none"
    >
      <v-icon
        v-if="tabitem.icon"
        :icon="tabitem.icon"
        :size="mobile ? '30' : '20'"
        :start="!mobile"
        :color="tabitem.colorIcon || ''"
      />
      <div class="d-flex align-center">
        <span class="text-body-2">
          {{ tabitem.title }}
        </span>

        <slot name="tab-title" />
      </div>
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item
      v-for="(tabitem, index) in tabs"
      :key="index"
      :value="index + 1"
    >
      <slot name="content" />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup lang="ts">
type AlignProps = "title" | "center" | "end" | "start" | undefined;

import type { TabProps } from "@/types/Tab";
import type { PropType } from "vue";
import { useDisplay } from "vuetify";

defineProps({
  tabs: {
    type: Array as PropType<TabProps[]>,
    required: true,
  },
  alignTabs: {
    type: String as PropType<AlignProps>,
    default: "start",
  },
});

defineEmits(["update:modelValue"]);

const { mobile } = useDisplay();

const tab = defineModel<Number>();
</script>

<style scoped>
/*
 * O .tab-buttons .v-btn original não funcionou porque os estilos scoped
 * só afetam o componente atual. Para estilizar elementos filhos que são renderizados
 * por outros componentes (como o Vuetify), você precisa de seletores de profundidade
 * ou de CSS global.
 *
 * A forma mais eficaz aqui é aplicar a margem diretamente à classe .v-tab,
 * que é o elemento raiz de cada tab. Usamos !important para garantir que
 * nosso estilo prevaleça sobre os estilos padrão do Vuetify, caso haja conflito de especificidade.
 */
.v-tab {
  color: #1e3c98 !important;
  font-weight: 800;
  margin-right: 0.5rem;
  background-color: #f7f7f7 !important;
  border-radius: 2.5rem !important;

  height: 2.25rem !important; /* altura mínima menor */
  margin-bottom: 8px !important; /* Adicionado: margem inferior de 8px */
}

.v-tab--selected .v-btn {
  border-radius: 2rem !important;
}

.v-tab--selected {
  background-color: #1e3c98 !important;
  border-radius: 2.5rem !important;
}

.v-tab.v-tab--selected {
  background-color: #1e3c98 !important;
  color: #fff !important;
}
</style>

<!-- <template>
  <v-tabs
    v-model="tab"
    color="grey-darken-2"
    :grow="mobile"
    :align-tabs="alignTabs"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-tab
      v-for="(tabitem, index) in tabs"
      :value="index + 1"
      :key="index"
      class="text-none"
    >
      <v-icon
        v-if="tabitem.icon"
        :icon="tabitem.icon"
        :size="mobile ? '30' : '20'"
        :start="!mobile"
        :color="tabitem.colorIcon || ''"
      />
      <div class="d-flex align-center">
        <span v-if="!mobile" class="text-subtitle-2">
          {{ tabitem.title }}
        </span>

        <slot name="tab-title" />
      </div>
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item
      v-for="(tabitem, index) in tabs"
      :key="index"
      :value="index + 1"
      class="pa-4"
    >
      <slot name="content" />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup lang="ts">
type AlignProps = "title" | "center" | "end" | "start" | undefined;

import type { TabProps } from "@/types/Tab";
import type { PropType } from "vue";
import { useDisplay } from "vuetify";

defineProps({
  tabs: {
    type: Array as PropType<TabProps[]>,
    required: true,
  },
  alignTabs: {
    type: String as PropType<AlignProps>,
    default: "start",
  },
});

defineEmits(["update:modelValue"]);

const { mobile } = useDisplay();

const tab = defineModel<Number>();
</script>

<style scoped>
.tab-buttons .v-btn {
  margin-bottom: 8px;
}
.v-tab {
  color: #1e3c98 !important;
  font-weight: 800;
  margin-right: 0.5rem;
  background-color: #f7f7f7 !important;
  border-radius: 2.5rem !important;
  height: 2.25rem !important; /* altura mínima menor */
  font-size: 0.9rem !important; /* texto menor */
}

.v-tab--selected .v-btn {
  border-radius: 2rem !important;
}

.v-tab--selected {
  background-color: #1e3c98 !important;
  border-radius: 2.5rem !important;
}

.v-tab.v-tab--selected {
  background-color: #1e3c98 !important;
  color: #fff !important;
}
</style> -->
