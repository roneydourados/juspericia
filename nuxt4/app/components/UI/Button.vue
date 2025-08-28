<template>
  <v-btn
    class="text-none"
    :color="color"
    :size="size"
    :variant="variant"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :rounded="rounded"
    :disabled="disabled"
    :loading="loading"
    @click="emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
type ButtonVariantType =
  | "flat"
  | "text"
  | "elevated"
  | "tonal"
  | "outlined"
  | "plain"
  | undefined;

defineProps({
  color: {
    type: String,
    default: "primary",
  },
  variant: {
    type: String as PropType<ButtonVariantType>,
    default: "flat",
  },
  size: {
    type: String,
    default: undefined,
  },
  prependIcon: {
    type: String,
    default: undefined,
  },
  appendIcon: {
    type: String,
    default: undefined,
  },
  rounded: {
    type: String,
    default: "xl",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);
</script>

<style scoped></style>
