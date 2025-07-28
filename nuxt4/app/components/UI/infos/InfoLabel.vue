<template>
  <div class="w-100">
    <div :style="`font-size: ${fontSize}rem`" class="d-flex align-center">
      <slot name="icon-title-preppend" />
      <v-icon v-if="icon" :color="colorIcon" class="mr-2">{{ icon }}</v-icon>

      <span
        :class="!mdAndUp ? 'text-truncate' : ''"
        :style="`font-size: ${fontSize}rem`"
      >
        {{ title }}
      </span>

      <slot name="icon-title-append" />
    </div>
    <div class="d-flex mt-1" style="font-size: 14px">
      <p class="font-weight-bold" :style="`font-size: ${fontSizeContent}rem`">
        {{ content }}
      </p>
    </div>
    <div class="w-100">
      <slot />
    </div>
    <v-divider v-if="showDivider" :thickness="thickness" />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps({
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  colorIcon: {
    type: String,
    default: "",
  },
  thickness: {
    type: Number,
    default: 1,
  },
  showDivider: {
    type: Boolean,
    default: true,
  },
  fontSize: {
    type: String,
    default: "0.75",
  },
  fontSizeContent: {
    type: String,
    default: "1",
  },
});

const { mdAndUp } = useDisplay();
</script>

<style scoped>
.text-truncate {
  width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
}
</style>
