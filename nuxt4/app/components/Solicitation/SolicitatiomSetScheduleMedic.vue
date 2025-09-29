<template>
  <DialogForm
    title="Vincular médico a solicitação"
    :show="show"
    @dialog="handleClose"
    :width="mobile ? '100%' : '40%'"
    borderColor="#c8e040"
  >
    <FormCrud :on-submit="handleConfirm">
      <v-row dense class="mt-">
        <v-col cols="12">
          <SelectSearchMedic v-model="model.medic" clearable required />
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

const handleConfirm = async () => {
  loading.value = true;
  try {
    if (!props.solicitation) {
      push.warning("Solicitação não informada!");
    }

    if (!props.solicitation.Schedule) {
      push.warning("Solicitação não possui Agendamento!");
    }

    if (!props.solicitation.Schedule?.[0]) {
      push.warning("Solicitação não possui Agendamento!");
    }

    if (!model.value.medic) {
      push.warning("Médico não informado!");
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
    show.value = false;
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
