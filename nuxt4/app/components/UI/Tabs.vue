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
.v-tab {
  color: #1e3c98 !important;
  font-weight: 800;
  margin-right: 0.5rem;
  background-color: #f7f7f7 !important;
  border-radius: 2.5rem !important;

  height: 2.25rem !important;
  margin-bottom: 8px !important;
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

:deep(.v-tab__slider) {
  display: none !important;
}
</style>
