<template>
  <CardBlur :hover="false">
    <v-card-title>
      <v-row dense>
        <v-col cols="12" class="mb-8">
          <HeaderPage title="Relatório de solicitações de consulta" />
        </v-col>
        <v-col cols="12" lg="2">
          <DatePicker
            v-model="filters.initialDate"
            label="Data inicial"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" lg="2">
          <DatePicker
            v-model="filters.finalDate"
            label="Data final"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" lg="3">
          <SelectSearchLawyer
            label="Advogado"
            v-model="filters.user"
            @update:model-value="indexReport"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="5">
          <SelectSearchPatient
            label="Paciente"
            v-model="filters.patient"
            @update:model-value="indexReport"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="2">
          <SelectInput
            label="Status"
            v-model="filters.status"
            item-title="text"
            item-value="value"
            :items="[
              { text: 'Todos', value: 'all' },
              { text: 'Abertas', value: 'open' },
              { text: 'Finalizada', value: 'finished' },
              { text: 'Cancelada', value: 'canceled' },
              { text: 'Paga', value: 'paid' },
              { text: 'Agendada', value: 'scheduled' },
              { text: 'Pendente de pagamento', value: 'payment_pending' },
            ]"
            @update:model-value="indexReport"
          />
        </v-col>
        <v-col cols="12" lg="5">
          <SelectSearchMedicalSpecialty
            label="Especialidade"
            v-model="filters.medicalSpecialty"
            @update:model-value="indexReport"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="2">
          <Button color="primary" @click="indexReport">
            <v-icon
              icon="mdi-file-document-edit-outline"
              start
              color="colorIcon"
            />
            Gerar Relatório
          </Button>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <!-- <pre>{{ $report }}</pre> -->
      <ReportConsultationList :items="$report" />
    </v-card-text>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const solicitationStore = usePatientConsultationReportStore();

const $report = computed(() => solicitationStore.$solicitationReports);

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  patient: undefined as PatientProps | undefined,
  user: undefined as UserProps | undefined,
  medicalSpecialty: undefined as MedicalSpecialtyProps | undefined,
  status: "all",
});

const indexReport = async () => {
  await solicitationStore.indexSolicitationReports({
    initialDate: filters.value.initialDate,
    finalDate: filters.value.finalDate,
    patientId: filters.value.patient?.id,
    userId: filters.value.user?.id,
    status: filters.value.status,
    medicalSpecialtyId: filters.value.medicalSpecialty?.id,
  });
};
</script>
