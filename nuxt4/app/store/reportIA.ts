import { defineStore } from "pinia";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const useReportIAStore = defineStore("reportIA", () => {
  const { api } = useAxios();

  const messages = ref<ChatMessage[]>([]);
  const loading = ref(false);
  let messageIdCounter = 0;

  const $messages = computed(() => messages.value);
  const $loading = computed(() => loading.value);

  const sendMessage = async (userPrompt: string) => {
    const userMessage: ChatMessage = {
      id: ++messageIdCounter,
      role: "user",
      content: userPrompt,
      timestamp: new Date(),
    };

    messages.value.push(userMessage);

    loading.value = true;

    try {
      const { data } = await api.post<string>("/report-ia", {
        userPrompt,
      });

      const assistantMessage: ChatMessage = {
        id: ++messageIdCounter,
        role: "assistant",
        content: data,
        timestamp: new Date(),
      };

      messages.value.push(assistantMessage);
    } catch {
      const errorMessage: ChatMessage = {
        id: ++messageIdCounter,
        role: "assistant",
        content:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      };

      messages.value.push(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const clearMessages = () => {
    messages.value = [];
    messageIdCounter = 0;
  };

  return {
    $messages,
    $loading,
    sendMessage,
    clearMessages,
  };
});
