export interface ReportIaHistoryEntry {
  userPrompt: string;
  aiResponse: string;
}

export interface ReportIaHistoryRecord {
  id: number;
  publicId: string;
  userId: number;
  userPrompt: string;
  aiResponse: string;
  sqlGenerated: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportIaHistoryPaginated {
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
  };
  data: ReportIaHistoryRecord[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
