<template>
  <v-container v-if="$validadeRoom?.valid" class="pa-4">
    <div ref="container" class="rounded-xl shadow-md" />
  </v-container>
  <v-empty-state
    v-else
    headline="Sala Fechada/Expirada"
    title="Sala inválida"
    text="Não é mais possível acessar esta sala de teleconferência"
  />
  <v-overlay :model-value="loading" class="align-center justify-center">
    <v-progress-circular color="primary" size="64" indeterminate />
  </v-overlay>
</template>

<script setup lang="ts">
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

definePageMeta({
  title: "Teleconferência online",
  description: "Teleconferência online",
  layout: "register",
  middleware: undefined,
});

const route = useRoute();
const config = useRuntimeConfig();
const queryRoomStore = useQueryRoomStore();
const loading = ref(false);
const container = ref<HTMLDivElement>();
const kit = ref<ZegoUIKitPrebuilt>();

// roomId vem da URL dinâmica: /room/:roomId
const roomId = route.params.roomId as string;

// token vem da query string: ?token=abc123
const token = route.query.token as string;

const $validadeRoom = computed(() => queryRoomStore.$validadeRoomLink);

onMounted(async () => {
  loading.value = true;
  try {
    await queryRoomStore.validate(token);
    joinRoom();
  } catch (error) {
    console.error("Erro ao validar a sala:", error);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (kit.value) {
    kit.value.destroy();
  }
});

const joinRoom = () => {
  // Verificar se o container está disponível
  if (!container.value) {
    console.error("Container não está disponível");
    return;
  }

  if (!$validadeRoom.value) {
    console.error("Sala inválida");
    return;
  }

  if (!$validadeRoom.value.tokenKit) {
    console.error("Sala inválida");
    return;
  }

  try {
    const tokenZegoRoomKit = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      Number(config.public.zegoCloudAppId),
      $validadeRoom.value.tokenKit, //token gerado na api
      roomId,
      $validadeRoom.value.userId,
      ""
    );

    kit.value = ZegoUIKitPrebuilt.create(tokenZegoRoomKit);
    //kit.value.setLanguage("en-US");

    kit.value.joinRoom({
      container: container.value,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // Para implementar chamadas 1-a-1
      },
      sharedLinks: [
        {
          name: "Junte-se à chamada",
          url: $validadeRoom.value.url,
        },
      ],
      showPreJoinView: true,
      preJoinViewConfig: {
        title: "Informe seu nome",
      },
      videoScreenConfig: {
        objectFit: "fill",
      },
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showTextChat: true,
      showUserList: false,
      maxUsers: 2,
      showLeaveRoomConfirmDialog: false,
      // Callbacks para eventos
      onLeaveRoom: handleClose,
      onJoinRoom: () => {
        console.log("Usuário entrou na sala");
      },
    });
  } catch (error) {
    console.error("Erro ao criar ou entrar na sala:", error);
  }
};

const handleClose = async () => {
  try {
    await queryRoomStore.closeRoom(token);
    console.log("🚀 ~ handleClose ~ token:", token);
    // Close the current browser window/tab
    window.close();
    // Fallback for browsers that block window.close()
    if (window.opener) {
      window.opener = null;
    }
  } catch (error) {
    console.error("Erro ao fechar a sala:", error);
  }
};
</script>
