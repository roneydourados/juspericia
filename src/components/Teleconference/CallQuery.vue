<template>
  <v-card flat class="pa-4 py-4">
    <div ref="root" />
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
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const route = useRoute();
const router = useRouter();
const storeConsultation = useSolicitationConsultationStore();
const auth = useAuthStore();
const config = useRuntimeConfig();

const $single = computed(() => storeConsultation.$single);
const $currentUser = computed(() => auth.$currentUser);

const id = String(route.params.id);
const root = ref();
const zp = ref<ZegoUIKitPrebuilt>();
const loading = ref(false);

onMounted(async () => {
  await storeConsultation.show(id);
  joinRoom();
});

onUnmounted(() => {
  if (zp.value) {
    zp.value.destroy();
  }
});

const joinRoom = () => {
  if (!$single.value) return;

  const zpConfig = {
    appId: Number(config.public.zegoCloudAppId),
    secret: config.public.zegoCloudAppSecret,
    roomId: $single.value.publicId!,
    userId: $currentUser.value?.publicId!,
    userName: `${
      $currentUser.value?.Profile.type === "MEDICO" ? "Dr(a)" : ""
    } ${$currentUser.value?.name}`,
    appUrl: `${config.public.appUrl}/teleconference/${$single.value.publicId!}`,
  };

  const zegoKit = ZegoUIKitPrebuilt.generateKitTokenForTest(
    zpConfig.appId,
    zpConfig.secret,
    zpConfig.roomId,
    zpConfig.userId,
    zpConfig.userName
  );

  zp.value = ZegoUIKitPrebuilt.create(zegoKit);

  zp.value.joinRoom({
    container: root.value,
    scenario: {
      mode: ZegoUIKitPrebuilt.OneONoneCall, // Para implementar chamadas 1-a-1, modifique o parâmetro aqui para [ZegoUIKitPrebuilt.OneONoneCall].
    },
    showPreJoinView: true,
    preJoinViewConfig: {
      title: "Juntar-se à chamada",
    },
    onLeaveRoom: handleClose,
    showLeaveRoomConfirmDialog: false,
  });
};

const handleClose = async () => {
  if ($currentUser.value?.Profile.type === "MEDICO") {
    await router.push("/schedules");
    return;
  }

  await router.push("/solicitations");
};
</script>
