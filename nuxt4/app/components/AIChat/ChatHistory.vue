<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    location="right"
    temporary
    :width="mobile ? 320 : 380"
    style="z-index: 2100"
  >
    <div class="d-flex flex-column" style="height: 100%">
      <!-- Header -->
      <div
        class="d-flex align-center justify-space-between px-4 py-3"
        style="
          background: linear-gradient(135deg, #5574ed, #7c4dff);
          flex-shrink: 0;
        "
      >
        <div class="d-flex align-center" style="gap: 0.5rem">
          <v-icon icon="mdi-history" color="white" size="22" />
          <span class="text-white font-weight-bold text-body-2">
            Histórico de conversas
          </span>
        </div>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="emit('update:modelValue', false)"
        >
          <v-icon icon="mdi-close" color="white" size="20" />
        </v-btn>
      </div>

      <!-- Content -->
      <div class="flex-grow-1 overflow-y-auto">
        <v-progress-linear
          v-if="$loadingHistory"
          indeterminate
          color="purple"
        />

        <!-- Empty -->
        <div
          v-if="!$loadingHistory && $historyRecords.length === 0"
          class="d-flex flex-column align-center justify-center pa-8"
          style="height: 100%"
        >
          <v-icon icon="mdi-chat-sleep-outline" color="grey" size="48" />
          <span class="text-body-2 text-grey mt-4 text-center">
            Nenhuma conversa anterior encontrada
          </span>
        </div>

        <!-- History List -->
        <v-list v-else lines="three" class="pa-2">
          <template v-for="(group, date) in groupedRecords" :key="date">
            <v-list-subheader class="text-caption font-weight-bold">
              {{ date }}
            </v-list-subheader>
            <v-list-item
              v-for="record in group"
              :key="record.id"
              rounded="xl"
              class="mb-1"
              @click="handleRestore(record)"
            >
              <template #prepend>
                <v-avatar color="purple" variant="tonal" size="36">
                  <v-icon
                    icon="mdi-message-text-outline"
                    size="18"
                    color="purple"
                  />
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-bold">
                {{ truncate(record.userPrompt, 60) }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ truncate(record.aiResponse, 80) }}
              </v-list-item-subtitle>
              <template #append>
                <span class="text-caption text-grey">
                  {{ formatTime(record.createdAt) }}
                </span>
              </template>
            </v-list-item>
          </template>
        </v-list>

        <!-- Load More -->
        <div v-if="$hasMoreHistory" class="d-flex justify-center pa-4">
          <v-btn
            variant="outlined"
            color="purple"
            size="small"
            rounded="xl"
            class="text-none"
            :loading="$loadingHistory"
            @click="reportIAStore.loadMoreHistory()"
          >
            <v-icon icon="mdi-refresh" size="16" start />
            Carregar mais
          </v-btn>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
import type { ReportIaHistoryRecord } from "@/types/ReportIA";

const { mobile } = useDisplay();
const reportIAStore = useReportIAStore();

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const $loadingHistory = computed(() => reportIAStore.$loadingHistory);
const $historyRecords = computed(() => reportIAStore.$historyRecords);
const $hasMoreHistory = computed(() => reportIAStore.$hasMoreHistory);

const groupedRecords = computed(() => {
  const groups: Record<string, ReportIaHistoryRecord[]> = {};

  for (const record of $historyRecords.value) {
    const date = dayjs(record.createdAt).format("DD/MM/YYYY");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
  }

  return groups;
});

onMounted(() => {
  reportIAStore.fetchHistory();
});

const truncate = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const formatTime = (dateStr: string) => {
  return dayjs(dateStr).format("HH:mm");
};

const handleRestore = (record: ReportIaHistoryRecord) => {
  reportIAStore.restoreFromHistory([record]);
  emit("update:modelValue", false);
};
</script>
