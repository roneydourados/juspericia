<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            <div class="text-subtitle-1 font-weight-bold">
              Dados da consulta
            </div>
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn class="text-none" @click="dialog = false">
              <strong class="text-error">Cancelar</strong>
            </v-btn>
            <v-btn class="text-none" @click="handleQueryStart">
              <strong class="text-info">Iniciar consulta</strong>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <SolicitationDetails :show-voltar="false" :show-report="false" />
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
const queryRoomStore = useQueryRoomStore();
//const router = useRouter();

const $single = computed(() => scheduleStore.$single);
//const $solicitation = computed(() => solicitationStore.$single);
const $user = computed(() => auth.$currentUser);
const dialog = defineModel({ default: false });
const loading = ref(false);

const $roomLink = computed(() => queryRoomStore.$createdRoomLink);

const handleQueryStart = async () => {
  if (
    !$single.value ||
    !$single.value.PatientConsultation ||
    !$single.value.PatientConsultation.id
  ) {
    push.warning("Consulta não encontrada.");
    dialog.value = false;
    return;
  }

  dialog.value = false;
  loading.value = true;
  try {
    // enviar que a solicitação está em consulta telemedicine true
    // await solicitationStore.update({
    //   publicId: $single.value.PatientConsultation.publicId,
    //   isTelemedicine: true,
    //   medicId: $user.value?.id,
    //   dateClose: dayjs().format("YYYY-MM-DD"), // vai ficar como data da consulta até que seja finalizada pela tela de laudos ao clicar em digitar laudo
    // });

    // atualizar a agenda para start
    // await scheduleStore.startSchedule(
    //   $single.value.PatientConsultation.id!,
    //   $user.value?.id!
    // );

    await queryRoomStore.createRoomLink({
      solicitationId: $single.value.PatientConsultation.id,
    });

    // Aqui vai abrir a tela para conversação de vídeo criada no back-end

    if ($roomLink.value && $roomLink.value.url) {
      window.open($roomLink.value.url, "_blank");
    }
    // window.open(
    //   `/teleconference/${$single.value?.PatientConsultation.publicId}`,
    //   "_blank"
    // );
    // await router.push(
    //   `/teleconference/${$single.value?.PatientConsultation.publicId}`
    // );

    emit("start-query");
  } catch (error) {
    console.error("Erro ao iniciar consulta:", error);
    push.error("Erro ao iniciar consulta.");
  } finally {
    loading.value = false;
  }
};
</script>
