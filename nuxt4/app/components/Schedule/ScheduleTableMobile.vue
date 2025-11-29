<template>
  <div class="d-flex justify-end align-center mb-2 px-4">
    <v-pagination
      v-model="page"
      :length="pageCount"
      color="primary"
      rounded="circle"
      density="comfortable"
      :total-visible="PAGINATION_TOTAL_VISIBLE"
    />
    <span class="text-caption text-primary">
      Pg. {{ page }} de {{ pageCount }}
    </span>
  </div>
  <v-row dense>
    <v-col cols="12" lg="2" class="d-flex justify-end mb-4">
      <div class="d-flex align-center" style="gap: 0.5rem">
        <Button
          variant="outlined"
          color="grey"
          class="text-none"
          size="small"
          @click="router.back()"
        >
          <v-icon icon="mdi-arrow-left" color="darkText" />
          <span class="text-darkText text-caption"> Voltar </span>
        </Button>
        <Button
          variant="flat"
          color="primary"
          class="text-none"
          size="small"
          @click="$emit('add')"
        >
          <v-icon icon="mdi-plus" color="colorIcon" />
          <span class="text-white text-caption"> Novo </span>
        </Button>
      </div>
    </v-col>
  </v-row>
  <CardBlur
    v-for="item in paginatedItems"
    :key="item.id"
    class="mb-2 text-primary"
    :hover="false"
    style="border-top: 3px solid #c8e040"
    height="225"
  >
    <template #title>
      <div>Dados da Agenda</div>
    </template>
    <template #content>
      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between align-center">
          <span>Paciente:</span>
          <strong>{{ item.PatientConsultation?.Patient?.name }}</strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span>Agendamento:</span>
          <strong>
            {{ dayjs(item.scheduleDate).format("DD/MM/YYYY") }} as
            {{ item.scheduleHour }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span>Status:</span>
          <v-chip
            :color="getStatusProps(item.status ?? '').color"
            :prepend-icon="getStatusProps(item.status ?? '').icon"
          >
            <span class="text-caption">
              {{ getStatusProps(item.status ?? "").text }}
            </span>
          </v-chip>
        </div>

        <v-divider class="mt-4"></v-divider>
      </div>
    </template>
    <template #actions>
      <div
        class="d-flex align-center justify-end mt-n8 w-100"
        style="gap: 0.5rem"
      >
        <Button
          variant="text"
          size="small"
          color="grey"
          @click="emit('solicitation-details', item)"
        >
          <v-icon
            icon="mdi-file-document-edit-outline"
            color="colorIcon"
            start
          />
          <strong class="text-primary">
            Solicitação: {{ item.patientConsultationId }}
          </strong>
        </Button>

        <v-btn
          v-if="
            item.status === 'completed' &&
            item.PatientConsultation?.PatientConsultationReport
          "
          color="primary"
          icon
          variant="text"
          @click="emit('report-details', item)"
        >
          <v-icon icon="mdi-file-document-arrow-right-outline" color="info" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Detalhes do laudo gerado
          </v-tooltip>
        </v-btn>
        <div v-else-if="item.status === 'active'" class="d-flex">
          <v-btn
            color="primary"
            icon
            variant="text"
            @click="emit('finish', item)"
          >
            <v-icon icon="mdi-clock-check-outline" color="colorIcon" />
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Finalizar atendiento
            </v-tooltip>
          </v-btn>
          <v-btn
            color="purple-darken-2"
            icon
            variant="text"
            @click="emit('service-details', item)"
          >
            <v-icon icon="mdi-stethoscope" size="20" color="purple" />
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Iniciar teleatendimento
            </v-tooltip>
          </v-btn>
        </div>
        <v-btn
          v-if="item.status === 'completed'"
          color="primary"
          icon
          variant="text"
          @click="emit('medical-report-form', item)"
        >
          <v-icon icon="mdi-file-document-edit-outline" color="colorIcon" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Escrever laudo
          </v-tooltip>
        </v-btn>
        <v-btn
          v-if="item.status === 'completed'"
          color="purple-darken-2"
          variant="text"
          @click="$emit('download-media', item)"
        >
          <v-icon icon="mdi-video-outline" size="20" color="purple" />
          <span class="text-caption"> Gravação </span>
        </v-btn>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const emit = defineEmits([
  "report-details",
  "medical-report-form",
  "service-details",
  "finish",
  "solicitation-details",
  "add",
  "download-media",
]);
const scheduleStore = useScheduleStore();
const { formatCPFOrCNPJ, formatTelephoneNumber } = useUtils();
const router = useRouter();
const $all = computed(() => scheduleStore.$all?.schedules || []);

const itemsPerPage = ref(10);
const page = ref(1);
const search = ref("");
const paginatedItems = computed(() => {
  const all = $all.value || [];
  const start = (page.value - 1) * itemsPerPage.value;
  return all.slice(start, start + itemsPerPage.value);
});

const pageCount = computed(() => {
  const all = $all.value || [];

  if (all.length === 0) return all.length;

  return Math.ceil(all.length / itemsPerPage.value);
});

const getStatusProps = (status: string) => {
  switch (status) {
    case "completed":
      return {
        color: "green",
        text: "Concluído",
        icon: "mdi-check",
      };
    case "cancelled":
      return {
        color: "red",
        text: "Cancelado",
        icon: "mdi-close",
      };
    case "pending":
      return {
        color: "orange",
        text: "Pendente",
        icon: "mdi-clock-outline",
      };
    default:
      return {
        color: "blue",
        text: "Agendado",
        icon: "mdi-calendar-month",
      };
  }
};
</script>
