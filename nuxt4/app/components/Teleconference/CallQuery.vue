<template>
  <v-card flat class="pa-4 py-4">
    <!-- <div ref="root" /> -->
    <v-card-actions class="d-flex justify-end px-12">
      <v-btn
        class="text-none"
        variant="flat"
        color="primary"
        @click="handleClose"
      >
        <v-icon icon="mdi-arrow-left" start />
        <strong>Voltar</strong>
      </v-btn>

      <v-btn
        class="text-none"
        variant="flat"
        color="success"
        @click="handleClose"
      >
        <v-icon icon="mdi-contain-end" start />
        <strong>Finalizar consulta</strong>
      </v-btn>
    </v-card-actions>
  </v-card>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
//import dayjs from "dayjs";
const route = useRoute();
const router = useRouter();
const storeConsultation = useSolicitationConsultationStore();
//const scheduleStore = useScheduleStore();
const auth = useAuthStore();

//const config = useRuntimeConfig();

// const $single = computed(() => storeConsultation.$single);
// const $currentUser = computed(() => auth.$currentUser);

// const id = String(route.params.id);
//const root = ref();
// const zp = ref<ZegoUIKitPrebuilt>();
const loading = ref(false);

const isFinishSolicitation = ref(false);

// onMounted(async () => {
//   await storeConsultation.show(id);
//   //joinRoom();
// });

onUnmounted(() => {
  // if (zp.value) {
  //   zp.value.destroy();
  // }
});

// const joinRoom = () => {
//   if (!$single.value) return;

//   const zpConfig = {
//     appId: Number(config.zegoCloudAppId),
//     secret: config.zegoCloudAppSecret,
//     roomId: $single.value.publicId!,
//     userId: $currentUser.value?.publicId!,
//     userName: `${
//       $currentUser.value?.profile?.type === "MEDICO" ? "Dr(a)" : ""
//     } ${$currentUser.value?.name}`,
//     appUrl: `${config.public.appUrl}/teleconference/${$single.value.publicId!}`,
//   };

//   const zegoKit = ZegoUIKitPrebuilt.generateKitTokenForTest(
//     zpConfig.appId,
//     zpConfig.secret,
//     zpConfig.roomId,
//     zpConfig.userId,
//     zpConfig.userName
//   );

//   zp.value = ZegoUIKitPrebuilt.create(zegoKit);

//   zp.value.joinRoom({
//     container: root.value,
//     scenario: {
//       mode: ZegoUIKitPrebuilt.OneONoneCall, // Para implementar chamadas 1-a-1, modifique o parâmetro aqui para [ZegoUIKitPrebuilt.OneONoneCall].
//     },
//     showPreJoinView: true,
//     preJoinViewConfig: {
//       title: "Juntar-se à chamada",
//     },
//     onLeaveRoom: handleClose,
//     showLeaveRoomConfirmDialog: false,
//   });
// };

const handleClose = () => {
  router.push("/schedules");
};

// const finalizeConsultation = async () => {
//   if (!$single.value) {
//     push.error("Consulta não encontrada");
//     return;
//   }

//   loading.value = true;
//   try {
//     isFinishSolicitation.value = true;
//     const payload = {
//       publicId: $single.value?.publicId,
//       isTelemedicine: false,
//       status: isFinishSolicitation.value ? "finished" : undefined,
//       dateClose: isFinishSolicitation.value
//         ? dayjs().format("YYYY-MM-DD")
//         : undefined,
//     };

//     //desativar teleconsulta
//     await storeConsultation.update(payload);

//     //finalizar agenda
//     await scheduleStore.finalizeSchedule($single.value.id!);

//     //retornar para lista de consultas
//     await router.push("/schedules");
//   } catch (error) {
//     console.error(error);
//   } finally {
//     loading.value = false;
//   }
// };
</script>
