<template>
  <DialogForm
    :show="show"
    title="Agendamento de consulta"
    :width="mobile ? '' : width"
    @dialog="handleDialog"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense>
        <v-col cols="12" lg="9">
          <SelectSearchMedic
            v-model="model.medic"
            label="Médico"
            required
            clearable
            @update:model-value="handleEnabledDisabledHours"
          />
        </v-col>
        <v-col cols="12" lg="3">
          <DatePicker
            v-model="model.scheduleDate"
            label="Agendar para o dia"
            required
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <strong>Dados da solicitação de consulta</strong>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Solicitado:</span>
          <span class="font-weight-bold">
            {{ moment(solicitation.dateOpen).format("DD/MM/YYYY") }}
          </span>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex align-center" style="gap: 0.5rem">
          <span>Tipo benefício:</span>
          <span class="font-weight-bold">
            {{ solicitation.BenefitType?.name }}
          </span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="4" class="d-flex align-center" style="gap: 0.5rem">
          <span>Finalidade:</span>
          <span class="font-weight-bold">
            {{ solicitation.ReportPurpose?.name }}
            {{
              solicitation.processSituation
                ? solicitation.processSituation === "PD"
                  ? "Processo distribuido"
                  : "Processo andamento"
                : ""
            }}
          </span>
        </v-col>

        <v-col
          v-if="solicitation.proccessNumber"
          cols="12"
          lg="4"
          class="d-flex align-center"
          style="gap: 0.5rem"
        >
          <span>Nº Processo:</span>
          <span class="font-weight-bold">
            {{ solicitation.proccessNumber }}
          </span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Solicitante:</span>
          <span class="font-weight-bold">
            {{ solicitation.Patient?.User?.name }}
          </span>
        </v-col>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Escritório:</span>
          <strong>
            {{ solicitation.Patient?.User?.officeName }}
          </strong>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" class="d-flex align-center" style="gap: 0.5rem">
          <span>Paciente:</span>
          <span class="font-weight-bold">
            {{ solicitation.Patient?.name }}
            {{ solicitation.Patient?.surname }}
          </span>
        </v-col>
      </v-row>
      <v-row dense class="mt-4">
        <v-col cols="12">
          <strong>Horários disponíveis</strong>
        </v-col>
        <v-col cols="12">
          <MedicHours :disabled="disablebHours" />
        </v-col>
      </v-row>
    </FormCrud>
    <!-- <pre>{{ model }}</pre> -->
  </DialogForm>
</template>

<script setup lang="ts">
import moment from "moment";
import { useDisplay } from "vuetify";

const props = defineProps({
  width: {
    type: String,
    default: "700",
  },
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => ({}),
  },
  data: {
    type: Object as PropType<ScheduleProps>,
    default: () => ({}),
  },
});

const emit = defineEmits(["scheduled"]);
const disablebHours = ref(true);
const show = defineModel<boolean>({ default: false });
const scheduleStore = useScheduleStore();
const { mobile } = useDisplay();

const model = ref({
  medic: undefined as UserProps | undefined,
  scheduleDate: moment().format("YYYY-MM-DD"),
  scheduleHour: "",
});

const submitForm = async () => {
  try {
    const schedule = {
      title: `Agendamento de consulta referente a solicitação de ${props.solicitation.Patient?.name} ${props.solicitation.Patient?.surname}`,
      medicId: model.value.medic?.id,
      scheduleDate: model.value.scheduleDate,
      scheduleHour: model.value.scheduleHour,
      patientConsultationId: props.solicitation.id,
    };

    if (props.data.id) {
      await scheduleStore.update({ ...schedule, id: props.data.id });
    } else {
      await scheduleStore.create(schedule);
    }
  } finally {
    handleDialog();
    emit("scheduled");
  }
};

const handleEnabledDisabledHours = () => {
  disablebHours.value = !model.value.medic;
};

const handleDialog = () => {
  show.value = false;
  disablebHours.value = true;
};
</script>
