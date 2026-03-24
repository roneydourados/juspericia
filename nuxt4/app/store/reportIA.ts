import { defineStore } from "pinia";
import type {
  ChatMessage,
  ReportIaHistoryEntry,
  ReportIaHistoryRecord,
  ReportIaHistoryPaginated,
} from "@/types/ReportIA";

export const useReportIAStore = defineStore("reportIA", () => {
  const { apiSilent } = useAxiosSilent();

  const chatMessages = ref<ChatMessage[]>([]);
  const history = ref<ReportIaHistoryEntry[]>([]);
  const historyRecords = ref<ReportIaHistoryRecord[]>([]);
  const historyMeta = ref({
    total: 0,
    perPage: 10,
    currentPage: 1,
    lastPage: 1,
    firstPage: 1,
  });
  const loading = ref(false);
  const loadingHistory = ref(false);

  const $chatMessages = computed(() => chatMessages.value);
  const $loading = computed(() => loading.value);
  const $loadingHistory = computed(() => loadingHistory.value);
  const $historyRecords = computed(() => historyRecords.value);
  const $historyMeta = computed(() => historyMeta.value);
  const $hasMoreHistory = computed(
    () => historyMeta.value.currentPage < historyMeta.value.lastPage
  );

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const sendMessage = async (userPrompt: string) => {
    chatMessages.value.push({
      id: generateId(),
      role: "user",
      content: userPrompt,
      timestamp: new Date(),
    });

    loading.value = true;

    try {
      const { data } = await apiSilent.post<string>("/report-ia", {
        userPrompt,
        history: history.value,
      });

      const aiResponse = typeof data === "string" ? data : String(data);

      chatMessages.value.push({
        id: generateId(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      });

      history.value.push({ userPrompt, aiResponse });
    } catch {
      chatMessages.value.push({
        id: generateId(),
        role: "assistant",
        content:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      });
    } finally {
      loading.value = false;
    }
  };

  const fetchHistory = async (page = 1, limit = 10) => {
    loadingHistory.value = true;

    try {
      const { data } = await apiSilent.get<ReportIaHistoryPaginated>(
        "/report-ia/history",
        {
          params: { page, limit },
        }
      );

      if (page === 1) {
        historyRecords.value = data.data;
      } else {
        historyRecords.value.push(...data.data);
      }

      historyMeta.value = data.meta;
    } catch {
      // erro tratado pelo interceptor
    } finally {
      loadingHistory.value = false;
    }
  };

  const loadMoreHistory = async () => {
    if ($hasMoreHistory.value && !loadingHistory.value) {
      await fetchHistory(historyMeta.value.currentPage + 1);
    }
  };

  const clearChat = () => {
    chatMessages.value = [];
    history.value = [];
  };

  const restoreFromHistory = (records: ReportIaHistoryRecord[]) => {
    chatMessages.value = [];
    history.value = [];

    for (const record of records) {
      chatMessages.value.push({
        id: generateId(),
        role: "user",
        content: record.userPrompt,
        timestamp: new Date(record.createdAt),
      });

      chatMessages.value.push({
        id: generateId(),
        role: "assistant",
        content: record.aiResponse,
        timestamp: new Date(record.createdAt),
      });

      history.value.push({
        userPrompt: record.userPrompt,
        aiResponse: record.aiResponse,
      });
    }
  };

  return {
    $chatMessages,
    $loading,
    $loadingHistory,
    $historyRecords,
    $historyMeta,
    $hasMoreHistory,
    sendMessage,
    fetchHistory,
    loadMoreHistory,
    clearChat,
    restoreFromHistory,
  };
});
