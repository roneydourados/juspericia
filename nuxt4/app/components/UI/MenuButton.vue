<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        :variant="variant"
        :color="color"
        :disabled="disabled"
        icon="mdi-dots-vertical"
        v-bind="props"
        :size="size"
      ></v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        @click="$emit('click', item.title)"
      >
        <template #prepend>
          <v-icon :icon="item.icon" :color="item.iconColor" size="20" />
        </template>
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import type { MenuButtonProps } from "@/types/MenuButton";

// import { MenuButtonProps } from "@/interfaces";
type VariantProps =
  | "flat"
  | "text"
  | "elevated"
  | "tonal"
  | "outlined"
  | "plain"
  | undefined;

defineProps({
  items: {
    type: Array as PropType<MenuButtonProps[]>,
    required: true,
  },
  size: {
    type: String,
    default: "30",
  },
  variant: {
    type: String as PropType<VariantProps>,
    default: "text",
  },
  color: {
    type: String,
    default: "grey",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>
