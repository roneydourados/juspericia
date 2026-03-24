<template>
  <div>
    <!-- FAB Button -->
    <v-btn
      icon
      color="purple"
      size="56"
      class="fab-ia-button elevation-6"
      @click="chatOpen = !chatOpen"
    >
      <v-icon
        :icon="chatOpen ? 'mdi-close' : 'mdi-robot-happy-outline'"
        size="28"
      />
      <v-tooltip
        activator="parent"
        location="left"
        content-class="tooltip-background"
      >
        Assistente IA
      </v-tooltip>
    </v-btn>

    <!-- Chat Window -->
    <v-card
      v-show="chatOpen"
      class="chat-window"
      :class="mobile ? 'chat-window-mobile' : 'chat-window-desktop'"
      rounded="xl"
      elevation="8"
      color="background"
    >
      <!-- Header -->
      <v-card-title class="chat-header pa-0">
        <div
          class="d-flex align-center justify-space-between px-4 py-3"
          style="
            background: linear-gradient(135deg, #5574ed, #7c4dff);
            border-radius: 24px 24px 0 0;
          "
        >
          <div class="d-flex align-center" style="gap: 0.75rem">
            <v-avatar color="white" size="36" variant="tonal">
              <v-icon icon="mdi-robot-happy-outline" color="purple" size="22" />
            </v-avatar>
            <div class="d-flex flex-column">
              <span class="text-white font-weight-bold text-body-2">
                Assistente IA
              </span>
              <span class="text-white text-caption" style="opacity: 0.8">
                {{ $loading ? "Digitando..." : "Online" }}
              </span>
            </div>
          </div>
          <div class="d-flex align-center" style="gap: 0.25rem">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="handleClearChat"
              :disabled="$messages.length === 0"
            >
              <v-icon icon="mdi-broom" color="white" size="20" />
              <v-tooltip
                activator="parent"
                location="top"
                content-class="tooltip-background"
              >
                Limpar conversa
              </v-tooltip>
            </v-btn>
            <v-btn icon variant="text" size="small" @click="chatOpen = false">
              <v-icon icon="mdi-chevron-down" color="white" size="24" />
              <v-tooltip
                activator="parent"
                location="top"
                content-class="tooltip-background"
              >
                Minimizar
              </v-tooltip>
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <!-- Messages Area -->
      <v-card-text ref="messagesContainer" class="chat-messages pa-4">
        <!-- Empty State -->
        <div
          v-if="$messages.length === 0"
          class="d-flex flex-column align-center justify-center"
          style="height: 100%"
        >
          <v-avatar color="purple" size="64" variant="tonal" class="mb-4">
            <v-icon icon="mdi-robot-happy-outline" size="36" color="purple" />
          </v-avatar>
          <span class="text-body-1 font-weight-bold text-colorTextPrimary mb-2">
            Olá! Como posso ajudar?
          </span>
          <span
            class="text-caption text-grey text-center"
            style="max-width: 250px"
          >
            Pergunte qualquer coisa e farei o possível para ajudar você.
          </span>
        </div>

        <!-- Messages -->
        <AIChatMessageBubble
          v-for="message in $messages"
          :key="message.id"
          :message="message"
        />

        <!-- Typing Indicator -->
        <div
          v-if="$loading"
          class="d-flex align-center mb-3"
          style="gap: 0.5rem"
        >
          <v-avatar color="purple" size="32">
            <v-icon icon="mdi-robot-outline" size="18" color="white" />
          </v-avatar>
          <v-card
            color="surface"
            variant="flat"
            rounded="xl"
            class="pa-3"
            style="border: 1px solid rgba(var(--v-theme-primary), 0.12)"
          >
            <div class="typing-indicator d-flex align-center" style="gap: 4px">
              <span class="typing-dot" />
              <span class="typing-dot" />
              <span class="typing-dot" />
            </div>
          </v-card>
        </div>
      </v-card-text>

      <!-- Input Area -->
      <v-card-actions class="chat-input-area pa-3 pt-0">
        <v-divider class="mb-3" />
        <div class="d-flex align-center w-100" style="gap: 0.5rem">
          <v-textarea
            v-model="userInput"
            placeholder="Digite sua pergunta..."
            variant="outlined"
            density="compact"
            rounded="xl"
            rows="1"
            max-rows="3"
            auto-grow
            hide-details
            :disabled="$loading"
            color="purple"
            @keydown.enter.exact.prevent="handleSend"
          />
          <v-btn
            icon
            color="purple"
            variant="flat"
            size="40"
            :disabled="!userInput.trim() || $loading"
            :loading="$loading"
            @click="handleSend"
          >
            <v-icon icon="mdi-send" size="20" />
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const reportIAStore = useReportIAStore();

const chatOpen = ref(false);
const userInput = ref("");
const messagesContainer = ref<any>(null);

const $messages = computed(() => reportIAStore.$messages);
const $loading = computed(() => reportIAStore.$loading);

const scrollToBottom = () => {
  nextTick(() => {
    const container = messagesContainer.value?.$el || messagesContainer.value;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

watch(
  $messages,
  () => {
    scrollToBottom();
  },
  { deep: true },
);

watch(chatOpen, (open) => {
  if (open) {
    scrollToBottom();
  }
});

const handleSend = async () => {
  const prompt = userInput.value.trim();
  if (!prompt || $loading.value) return;

  userInput.value = "";
  await reportIAStore.sendMessage(prompt);
};

const handleClearChat = () => {
  reportIAStore.clearMessages();
};
</script>

<style scoped>
.fab-ia-button {
  position: fixed !important;
  bottom: 100px;
  right: 16px;
  z-index: 2001;
  border-radius: 50% !important;
}

.chat-window {
  position: fixed;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-window-desktop {
  bottom: 150px;
  right: 24px;
  width: 400px;
  height: 550px;
}

.chat-window-mobile {
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 0 !important;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.chat-input-area {
  flex-direction: column;
  border-top: none;
}

/* Typing indicator animation */
.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-purple));
  animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
