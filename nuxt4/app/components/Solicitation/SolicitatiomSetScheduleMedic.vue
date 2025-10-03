<template>
  <DialogForm
    title="Vincular médico a solicitação"
    :show="show"
    @dialog="handleClose"
    :width="mobile ? '100%' : '40%'"
    borderColor="#c8e040"
  >
    <FormCrud :on-submit="handleConfirm">
      <v-row>
        <v-col cols="12">
          <strong>Data solicitação:</strong>
          {{
            dayjs(props.solicitation?.Schedule?.[0]?.scheduleDate).format(
              "DD/MM/YYYY"
            )
          }}
          <strong>
            (
            {{
              dayjs(props.solicitation?.Schedule?.[0]?.scheduleDate)
                .locale("pt-br")
                .format("ddd")
            }}
            )
          </strong>
        </v-col>
        <v-col cols="12">
          <SelectSearchMedic v-model="model.medic" clearable required />
        </v-col>
        <v-col
          cols="12"
          class="d-flex align-center px-4 mb-8"
          style="gap: 0.5rem"
        >
          <strong>Agenda:</strong>
          <v-chip v-for="day in availableDaysOfWeek" :key="day" color="blue">
            {{ day }}
          </v-chip>
        </v-col>
      </v-row>
    </FormCrud>
    <DialogLoading :dialog="loading" />
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { PropType } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => {},
  },
});

const emit = defineEmits(["close"]);

const { mobile } = useDisplay();
const scheduleStore = useScheduleStore();
const solicitationStore = useSolicitationConsultationStore();
const nuvidioStore = useNuvidioStore();

const show = defineModel("show", {
  default: false,
});
const loading = ref(false);
const model = ref({
  medic: undefined as UserProps | undefined,
});

// Computed que retorna os dias da semana únicos do médico selecionado
const availableDaysOfWeek = computed(() => {
  if (!model.value.medic?.doctorSchedules) {
    return [];
  }

  // Mapeamento dos números dos dias para abreviações
  const dayAbbreviations = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Extrai os dias únicos e mapeia para abreviações
  const uniqueDays = [
    ...new Set(
      model.value.medic.doctorSchedules.map((schedule) => schedule.dayOfWeek)
    ),
  ].filter((day) => day !== undefined);

  return uniqueDays
    .sort() // Ordena os dias (0=Dom, 1=Seg, etc.)
    .map((dayNumber) => dayAbbreviations[dayNumber!]);
});

const handleConfirm = async () => {
  loading.value = true;
  try {
    if (!props.solicitation) {
      push.warning("Solicitação não informada!");
      return;
    }

    if (!props.solicitation.Schedule) {
      push.warning("Solicitação não possui Agendamento!");
      return;
    }

    if (!props.solicitation.Schedule?.[0]) {
      push.warning("Solicitação não possui Agendamento!");
      return;
    }

    if (!model.value.medic) {
      push.warning("Médico não informado!");
      return;
    }

    if (!model.value.medic?.nuvidioDepartmentId) {
      push.warning(
        "Médico não possui departamento no Nuvidio! Não foi vinculado!"
      );
      return;
    }

    // obtém o dia da semana da data da solicitação (0=Dom, 1=Seg, ..., 6=Sáb)
    const scheduleDate = dayjs(props.solicitation?.Schedule?.[0]?.scheduleDate);
    const requestedDayOfWeek = scheduleDate.day();

    // verifica se o médico atende no dia da semana da solicitação
    const medicWorksOnThisDay = model.value.medic?.doctorSchedules?.some(
      (s) => s.dayOfWeek === requestedDayOfWeek
    );

    if (!medicWorksOnThisDay) {
      push.warning("Médico não atende no dia da semana da solicitação!");
      return;
    }

    //atualizar a agenda para start
    await scheduleStore.startSchedule(
      props.solicitation.id!,
      model.value.medic?.id!
    );

    //verificar se já tem um link, se sim então apagar primeiro
    if (
      props.solicitation.Schedule?.[0]?.nuvidioInviteLink &&
      props.solicitation.Schedule?.[0]?.nuvidioInviteLink.nuvidioId
    ) {
      await nuvidioStore.deleteInviteLink(
        props.solicitation.Schedule?.[0]?.nuvidioInviteLink.nuvidioId
      );
    }

    //criar link do atendimento
    const payloadCreateRoom = {
      publicId: props.solicitation.Schedule?.[0]?.publicId!,
      intrevalMinutes: 10,
    };

    await nuvidioStore.createInviteTeleConference(payloadCreateRoom);

    // enviar que a solicitação está em consulta telemedicine true e vincular o médico
    await solicitationStore.update({
      publicId: props.solicitation.publicId,
      isTelemedicine: true,
      medicId: model.value.medic?.id,
      dateClose: dayjs().format("YYYY-MM-DD"), // vai ficar como data da consulta até que seja finalizada pela tela de laudos ao clicar em digitar laudo
    });

    handleClose();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  show.value = false;
  model.value = {
    medic: undefined,
  };
  emit("close");
};
</script>
