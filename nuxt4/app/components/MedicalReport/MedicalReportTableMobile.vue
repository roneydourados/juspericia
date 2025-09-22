<template>
  <div class="d-flex justify-end align-center mb-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      color="primary"
      rounded="circle"
      density="comfortable"
    />
    <span class="text-caption text-primary">
      Pg. {{ page }} de {{ pageCount }}
    </span>
  </div>
  <CardBlur
    v-for="item in paginatedItems"
    :key="item.id"
    class="mb-2 text-primary"
    :hover="false"
    style="border-top: 3px solid #c8e040"
  >
    <template #title>
      <div class="d-flex justify-space-between">
        <div class="d-flex align-center" style="gap: 0.5rem">
          <span>Laudo:</span>
          <strong>#{{ item.reportId }}</strong>
        </div>
        <Button
          variant="text"
          v-if="!item.justifyId"
          @click="emit('correction', item)"
        >
          <v-icon icon="mdi-account-edit-outline" color="colorIcon" start />
          <span class="text-caption">Ver Justificativa </span>
        </Button>
      </div>
    </template>
    <template #content>
      <div class="d-flex flex-column" style="gap: 0.2rem">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex">
            <v-icon
              icon="mdi-file-document-edit-outline"
              color="colorIcon"
              start
            />
            Solicitação Nª:
          </div>
          <strong>{{ item.id }}</strong>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex">
            <v-icon icon="mdi-calendar-month" color="colorIcon" start />
            <span>Data consulta: </span>
          </div>
          <strong>{{ dayjs(item.dateClose).format("DD/MM/YYYY") }}</strong>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex">
            <v-icon icon="mdi-file-check-outline" color="colorIcon" start />
            <span>Benefício: </span>
          </div>
          <strong>{{ item.benefitType }}</strong>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex">
            <v-icon
              icon="mdi-file-document-arrow-right-outline"
              color="colorIcon"
              start
            />
            <span>Finalidade: </span>
          </div>
          <strong>{{ item.reportPurpose }}</strong>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex">
            <v-icon icon="mdi-account-outline" color="colorIcon" start />
            <span>Paciente: </span>
          </div>
          <strong>{{ item.patient }}</strong>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex">
            <v-icon icon="mdi-account-outline" color="colorIcon" start />
            <span>CPF: </span>
          </div>
          <strong>{{ formatCPFOrCNPJ(item.cpf) }}</strong>
        </div>
        <div class="d-flex align-center justify-end">
          <v-chip
            size="small"
            :color="getReportStatusColor(item.reportStatus).color"
            variant="flat"
            @click="emit('show-room', item)"
          >
            <v-icon
              :icon="getReportStatusColor(item.reportStatus).icon"
              start
            />
            <strong style="font-size: 0.7rem">
              {{
                item.reportStatus === "empty"
                  ? "Sem laudo (clique para consulta)"
                  : item.reportStatus === "cancel"
                  ? "Cancelado"
                  : item.reportStatus === "sign-pending"
                  ? "Assinatura pendente"
                  : item.reportStatus === "signed"
                  ? "Assinado"
                  : "Desconhecido"
              }}
            </strong>
          </v-chip>
        </div>
        <v-divider class="mt-4"></v-divider>
      </div>
    </template>
    <template #actions>
      <div class="d-flex flex-wrap w-100" style="gap: 0.5rem">
        <div
          v-if="item.reportContent && item.reportStatus !== 'cancel'"
          class="d-flex justify-content-center"
        >
          <Button
            v-if="item.reportStatus === 'sign-pending'"
            color="blue"
            variant="text"
            size="small"
            @click="emit('sign', item)"
          >
            <v-icon icon="mdi-file-edit-outline" size="20"></v-icon>
            <span class="text-caption"> Assinar documento </span>
          </Button>
          <Button
            v-else
            color="red"
            variant="text"
            size="small"
            @click="emit('download-sign', item)"
          >
            <v-icon icon="mdi-file-pdf-box" size="20"></v-icon>
            <span class="text-caption"> Laudo </span>
          </Button>
          <Button
            v-if="item.reportStatus === 'signed'"
            color="danger"
            variant="text"
            size="small"
            @click="emit('cancel-sign', item)"
          >
            <v-icon icon="mdi-pencil-off-outline" size="20"></v-icon>
            <span class="text-caption"> Cancelar assinatura </span>
          </Button>
          <Button
            v-if="
              ($currentUser?.profile?.type === 'ADMIN' ||
                $currentUser?.profile?.type === 'MEDICO') &&
              item.reportStatus !== 'signed'
            "
            color="orange"
            variant="text"
            size="small"
            @click="emit('correction', item)"
            :disabled="item.reportStatus === 'signed'"
          >
            <v-icon icon="mdi-clock-edit-outline" size="20"></v-icon>
            <span class="text-caption"> Correção/Editar </span>
          </Button>
        </div>
        <div class="d-flex justify-content-center">
          <Button
            v-if="!item.reportContent && item.reportStatus === 'empty'"
            color="info"
            variant="text"
            size="small"
            @click="emit('new', item)"
          >
            <v-icon icon="mdi-file-document-edit-outline" size="20"></v-icon>
            <span class="text-caption"> Digitar laudo </span>
          </Button>
          <Button
            color="purple"
            variant="text"
            size="small"
            @click="emit('details', item)"
          >
            <v-icon icon="mdi-dots-vertical-circle-outline" size="20"></v-icon>
            <span class="text-caption"> Detalhes do laudo </span>
          </Button>
        </div>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

const emit = defineEmits([
  "edit",
  "delete",
  "new",
  "correction",
  "show-room",
  "details",
  "sign",
  "cancel-sign",
  "download-sign",
]);
const consultationReport = usePatientConsultationReportStore();
const auth = useAuthStore();
const { formatCPFOrCNPJ } = useUtils();
// const { mobile } = useDisplay();

const $all = computed(() => consultationReport.$all ?? []);
const $currentUser = computed(() => auth.$currentUser);

const itemsPerPage = ref(10);
const page = ref(1);

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

const getReportStatusColor = (status: string) => {
  switch (status) {
    case "empty":
      return {
        color: "orange-darken-1",
        icon: "mdi-alert-circle-outline",
      };
    case "cancel":
      return {
        color: "red",
        icon: "mdi-close-circle-outline",
      };
    case "sign-pending":
      return {
        color: "blue",
        icon: "mdi-clock-alert-outline",
      };
    case "signed":
      return {
        color: "green",
        icon: "mdi-check-all",
      };
    default:
      return {
        color: "grey",
        icon: "mdi-help-circle-outline",
      };
  }
};
</script>
