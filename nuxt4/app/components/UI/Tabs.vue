<template>
  <v-tabs
    v-model="tab"
    color="primary"
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
        :icon="tabitem.icon"
        :size="mobile ? '30' : '24'"
        :start="!mobile"
      />
      <div class="d-flex align-center">
        <span v-if="!mobile">
          {{ tabitem.title }}
        </span>

        <slot name="tab-title" />
      </div>
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item
      v-for="index in tabs.length"
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
