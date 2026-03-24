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
      <div
        class="d-flex align-center justify-space-between px-4 py-3 chat-header"
      >
        <div class="d-flex align-center" style="gap: 0.75rem">
          <v-avatar color="white" size="36" variant="tonal">
            <v-icon icon="mdi-robot-happy-outline" size="22" />
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
          <v-btn icon variant="text" size="small" @click="showHistory = true">
            <v-icon icon="mdi-history" color="white" size="20" />
            <v-tooltip
              activator="parent"
              location="top"
              content-class="tooltip-background"
            >
              Histórico
            </v-tooltip>
          </v-btn>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="handleClearChat"
            :disabled="$chatMessages.length === 0"
          >
            <v-icon icon="mdi-chat-plus-outline" color="white" size="20" />
            <v-tooltip
              activator="parent"
              location="top"
              content-class="tooltip-background"
            >
              Nova conversa
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

      <!-- Messages Area -->
      <div ref="messagesContainer" class="chat-messages pa-4">
        <!-- Empty State -->
        <div
          v-if="$chatMessages.length === 0 && !$loading"
          class="d-flex flex-column align-center justify-center"
          style="height: 100%"
        >
          <v-avatar color="purple" size="64" variant="tonal" class="mb-4">
            <v-icon icon="mdi-robot-happy-outline" size="36" color="purple" />
          </v-avatar>
          <span class="text-body-1 font-weight-bold text-colorTextPrimary mb-2">
            Faça uma pergunta sobre os dados do sistema
          </span>
          <span
            class="text-caption text-grey text-center mb-6"
            style="max-width: 300px"
          >
            Posso ajudar com informações sobre pacientes, médicos, solicitações,
            faturamento e muito mais.
          </span>

          <!-- Sugestões -->
          <div class="d-flex flex-column" style="gap: 0.5rem; width: 100%">
            <v-btn
              v-for="suggestion in suggestions"
              :key="suggestion"
              variant="outlined"
              color="purple"
              rounded="xl"
              class="text-none text-caption"
              size="small"
              @click="handleSuggestion(suggestion)"
            >
              <v-icon icon="mdi-lightbulb-outline" size="16" start />
              {{ suggestion }}
            </v-btn>
          </div>
        </div>

        <!-- Messages -->
        <MessageBubble
          v-for="msg in $chatMessages"
          :key="msg.id"
          :message="msg"
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
      </div>

      <!-- Input Area -->
      <div class="chat-input-area px-3 pb-3 pt-1">
        <v-divider class="mb-2" />
        <div class="d-flex align-end w-100" style="gap: 0.5rem">
          <v-textarea
            v-model="userInput"
            placeholder="Digite sua pergunta..."
            variant="outlined"
            density="compact"
            rounded="xl"
            rows="1"
            max-rows="4"
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
      </div>
    </v-card>

    <!-- History Drawer -->
    <ChatHistory v-model="showHistory" />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const reportIAStore = useReportIAStore();

const chatOpen = ref(false);
const showHistory = ref(false);
const userInput = ref("");
const messagesContainer = ref<HTMLElement | null>(null);

const $chatMessages = computed(() => reportIAStore.$chatMessages);
const $loading = computed(() => reportIAStore.$loading);

const suggestions = [
  "Quantos pacientes estão cadastrados?",
  "Qual o faturamento deste mês?",
  "Quantas solicitações foram feitas hoje?",
];

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(
  $chatMessages,
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

const handleSuggestion = (suggestion: string) => {
  userInput.value = suggestion;
  handleSend();
};

const handleClearChat = () => {
  reportIAStore.clearChat();
  reportIAStore.fetchHistory();
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
  bottom: 170px;
  right: 24px;
  width: 420px;
  height: 580px;
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

.chat-header {
  background: linear-gradient(135deg, #5574ed, #7c4dff);
  border-radius: 24px 24px 0 0;
  flex-shrink: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.chat-input-area {
  flex-shrink: 0;
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
