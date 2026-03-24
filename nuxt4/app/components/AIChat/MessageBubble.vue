<template>
  <div
    class="ai-chat-message d-flex mb-3"
    :class="isUser ? 'justify-end' : 'justify-start'"
  >
    <div
      class="d-flex"
      :class="isUser ? 'flex-row-reverse' : 'flex-row'"
      style="gap: 0.5rem; max-width: 85%"
    >
      <v-avatar
        :color="isUser ? 'primary' : 'purple'"
        size="32"
        class="flex-shrink-0"
      >
        <v-icon
          :icon="isUser ? 'mdi-account' : 'mdi-robot-outline'"
          size="18"
          color="white"
        />
      </v-avatar>

      <v-card
        :color="isUser ? 'primary' : 'surface'"
        variant="flat"
        rounded="xl"
        class="pa-3"
        :class="isUser ? 'user-bubble' : 'assistant-bubble'"
      >
        <span
          class="text-body-2"
          :class="isUser ? 'text-white' : 'text-colorTextPrimary'"
          style="white-space: pre-wrap; word-break: break-word"
        >
          {{ message.content }}
        </span>
        <div class="d-flex justify-end mt-1">
          <span
            class="text-caption"
            :class="isUser ? 'text-white' : 'text-grey'"
            style="opacity: 0.7; font-size: 0.65rem !important"
          >
            {{ formattedTime }}
          </span>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { ChatMessage } from "@/types/ReportIA";

const props = defineProps<{
  message: ChatMessage;
}>();

const isUser = computed(() => props.message.role === "user");
const formattedTime = computed(() =>
  dayjs(props.message.timestamp).format("HH:mm"),
);
</script>

<style scoped>
.user-bubble {
  border-bottom-right-radius: 4px !important;
}

.assistant-bubble {
  border-bottom-left-radius: 4px !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.12);
}
</style>

<style scoped>
.user-bubble {
  border-bottom-right-radius: 4px !important;
}

.assistant-bubble {
  border-bottom-left-radius: 4px !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.12);
}
</style>
