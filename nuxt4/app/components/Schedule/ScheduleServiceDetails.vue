<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar color="white">
          <v-toolbar-title>
            <div class="text-subtitle-1 font-weight-bold">
              Dados da consulta
            </div>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" lg="4">
              <SelectInput
                v-model="sheduleModel.initialTime"
                label="Tempo para iniciar consulta"
                hide-details
                :items="[
                  {
                    label: '10 minutos',
                    value: '10',
                  },
                  {
                    label: '20 minutos',
                    value: '20',
                  },
                  {
                    label: '30 minutos',
                    value: '30',
                  },
                  {
                    label: '40 minutos',
                    value: '40',
                  },
                  {
                    label: '1 hora',
                    value: '60',
                  },
                ]"
                item-title="label"
                item-value="value"
              />
            </v-col>
            <v-col
              cols="12"
              lg="2"
              class="d-flex align-center"
              style="gap: 0.5rem"
            >
              <Button variant="outlined" @click="dialog = false">
                <v-icon icon="mdi-close" start color="red" />
                <span class="text-grey-darken-1">Cancelar</span>
              </Button>
              <Button variant="outlined" @click="handleQueryStart">
                <v-icon icon="mdi-play" color="colorIcon" start />
                <span class="text-info">Iniciar consulta</span>
              </Button>
            </v-col>
            <v-col cols="12">
              <SolicitationDetails :show-voltar="false" :show-report="false" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const emit = defineEmits(["start-query"]);
const scheduleStore = useScheduleStore();
const solicitationStore = useSolicitationConsultationStore();
const auth = useAuthStore();
//const queryRoomStore = useQueryRoomStore();
const nuvidioStore = useNuvidioStore();
//const router = useRouter();

const $single = computed(() => scheduleStore.$single);
//const $solicitation = computed(() => solicitationStore.$single);
const $user = computed(() => auth.$currentUser);
const dialog = defineModel({ default: false });
const loading = ref(false);
const sheduleModel = ref({
  initialTime: "10",
});

//const $roomLink = computed(() => queryRoomStore.$createdRoomLink);
const $nuvidioLinkInvite = computed(() => nuvidioStore.$nuvidioLinkInvite);

const handleQueryStart = async () => {
  if (
    !$single.value ||
    !$single.value.PatientConsultation ||
    !$single.value.PatientConsultation.id ||
    !$single.value.id
  ) {
    push.warning("Consulta não encontrada.");
    dialog.value = false;
    return;
  }

  if (
    dayjs(
      `${$single.value.scheduleDate}T${$single.value.scheduleHour}`
    ).isBefore(dayjs().subtract(180, "minute"))
  ) {
    dialog.value = false;
    push.warning(
      "Não é mais possível gerar um atendimento para este agendamento porque a data já passou!"
    );
    return;
  }

  dialog.value = false;
  loading.value = true;
  try {
    // enviar que a solicitação está em consulta telemedicine true
    await solicitationStore.update({
      publicId: $single.value.PatientConsultation.publicId,
      isTelemedicine: true,
      medicId: $user.value?.id,
      dateClose: dayjs().format("YYYY-MM-DD"), // vai ficar como data da consulta até que seja finalizada pela tela de laudos ao clicar em digitar laudo
    });

    //atualizar a agenda para start
    await scheduleStore.startSchedule(
      $single.value.PatientConsultation.id,
      $user.value?.id!
    );

    const payloadCreateRoom = {
      publicId: $single.value.publicId!,
      intrevalMinutes: Number(sheduleModel.value.initialTime ?? "10"),
    };

    await nuvidioStore.createInviteTeleConference(payloadCreateRoom);

    if ($nuvidioLinkInvite.value && $nuvidioLinkInvite.value.invite) {
      //direcionar o  médico para atender
      window.open("https://atendimento.nuvidio.com/login", "_blank");
    }

    //voltar 10 min padrão
    sheduleModel.value.initialTime = "10";

    emit("start-query");
  } catch (error) {
    console.error("Erro ao iniciar consulta:", error);
    push.error("Erro ao iniciar consulta.");
  } finally {
    loading.value = false;
  }
};
</script>
