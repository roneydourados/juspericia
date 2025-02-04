<template>
  <v-card flat width="100%" height="100%">
    <v-toolbar>
      <v-toolbar-title>
        <div class="text-subtitle-1 font-weight-bold">
          Video conferência telemedicina
        </div>
      </v-toolbar-title>
    </v-toolbar>
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
const zc = ref<ZegoUIKitPrebuilt>();

onMounted(async () => {
  await storeConsultation.show(id);
  joinRoom();
});

onUnmounted(() => {
  if (zc.value) {
    zc.value.destroy();
  }
});

const joinRoom = () => {
  if (!$single.value) return;

  const zcConfig = {
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
    zcConfig.appId,
    zcConfig.secret,
    zcConfig.roomId,
    zcConfig.userId,
    zcConfig.userName
  );

  zc.value = ZegoUIKitPrebuilt.create(zegoKit);

  zc.value.joinRoom({
    container: root.value,
    scenario: {
      mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
    },
    showPreJoinView: true,
    preJoinViewConfig: {
      title: "Juntar-se à chamada",
    },
    onLeaveRoom: handleClose,
    showLeaveRoomConfirmDialog: false,
  });
};

const handleClose = () => {
  if ($currentUser.value?.Profile.type === "MEDICO") {
    router.push("/schedules");
    return;
  }
  router.push("/solicitations");
};
</script>
