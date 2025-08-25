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
      <div>Dados da solicitação</div>
    </template>
    <template #content>
      <div class="d-flex flex-column">
        <v-chip
          :color="solicitationStatusColor(item.status ?? '')"
          text-color="white"
          size="small"
          class="mb-4"
        >
          <span class="text-caption">
            {{ solicitationStatusName(item.status ?? "") }}
          </span>
        </v-chip>

        <div class="d-flex align-center">
          <v-icon icon="mdi-calendar-month" color="colorIcon" start />
          <strong>
            {{ dayjs(item.dateOpen).format("DD/MM/YYYY") }}
          </strong>
        </div>
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-file-document-refresh-outline"
            color="colorIcon"
            start
          />
          <strong>
            {{ item.BenefitType?.name }}
          </strong>
        </div>
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-file-document-refresh-outline"
            color="colorIcon"
            start
          />
          <strong>
            {{ item.ReportPurpose?.name }}
          </strong>
        </div>
        <div class="d-flex align-center">
          <v-icon icon="mdi-currency-usd" color="colorIcon" start />
          <strong>
            {{ amountFormated(Number(item.consultationValue) ?? 0, false) }}
          </strong>
        </div>
        <v-divider class="mt-4"></v-divider>
      </div>
    </template>
    <template #actions>
      <div
        class="d-flex align-center justify-end mt-n8 w-100"
        style="gap: 0.5rem"
      >
        <v-btn
          icon
          color="info"
          variant="text"
          size="small"
          @click="$router.push(`/solicitations/${item.publicId}`)"
        >
          <v-icon icon="mdi-file-document-multiple-outline" size="20"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Visualizar solicitação
          </v-tooltip>
        </v-btn>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const emit = defineEmits(["edit", "delete", "info"]);
const patientStore = usePatientStore();

const { amountFormated, solicitationStatusName, solicitationStatusColor } =
  useUtils();

const $all = computed(() => patientStore.$solicitations ?? []);

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
</script>
