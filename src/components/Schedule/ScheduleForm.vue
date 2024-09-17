<template>
  <DialogForm
    :show="show"
    title="Agendamento de consulta"
    :width="mobile ? '' : width"
    @dialog="show = false"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense>
        <v-col cols="12" lg="6">
          <SelectSearchMedic v-model="model.medic" label="Médico" required />
        </v-col>
        <v-col cols="12" lg="3">
          <DatePicker
            v-model="model.scheduleDate"
            label="Agendar para o dia"
            required
          />
        </v-col>
        <v-col cols="12" lg="3">
          <InputTime v-model="model.scheduleHour" label="Horário" required />
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
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Paciente:</span>
          <span class="font-weight-bold">
            {{ solicitation.Patient?.name }} {{ solicitation.Patient?.surname }}
          </span>
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

const show = defineModel<boolean>({ default: false });
const scheduleStore = useScheduleStore();
const { mobile } = useDisplay();

const model = ref({
  medic: undefined as UserProps | undefined,
  scheduleDate: moment().format("YYYY-MM-DD"),
  scheduleHour: {
    hour: moment().format("HH"),
    min: moment().format("mm"),
  },
});

const clearModel = () => {
  model.value = {
    medic: undefined,
    scheduleDate: moment().format("YYYY-MM-DD"),
    scheduleHour: {
      hour: moment().format("HH"),
      min: moment().format("mm"),
    },
  };
};

const loadModel = () => {
  model.value = {
    medic: props.data.Medic,
    scheduleDate: props.data.scheduleDate!,
    scheduleHour: {
      hour: moment(props.data.scheduleHour).format("HH"),
      min: moment(props.data.scheduleHour).format("mm"),
    },
  };
};

const submitForm = async () => {
  show.value = false;

  const schedule = {
    title: `Agendametno de consulta referente a solicitação de ${props.solicitation.Patient?.name} ${props.solicitation.Patient?.surname}`,
    medicId: model.value.medic?.id,
    scheduleDate: moment(model.value.scheduleDate).format("YYYY-MM-DD"),
    scheduleHour: `${model.value.scheduleHour.hour}:${model.value.scheduleHour.min}`,
    patientConsultationId: props.solicitation.id,
  };

  if (props.data.id) {
    await scheduleStore.update({ ...schedule, id: props.data.id });
  } else {
    await scheduleStore.create(schedule);
  }

  emit("scheduled");
};
</script>
