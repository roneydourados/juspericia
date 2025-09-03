<template>
  <v-container
    v-if="$validadeRoom?.valid"
    class="pa-2 pa-sm-2 pa-xs-1 fill-height"
  >
    <div ref="container" class="video-container rounded-xl shadow-md" />
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
const isHandleClose = ref(false);
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

onUnmounted(async () => {
  if (kit.value) {
    kit.value.destroy();
  }

  //se o usuário não clicou em finalizar chamada
  if (!isHandleClose.value) {
    await handleClose();
  }

  // Close the current browser window/tab
  window.close();
  // Fallback for browsers that block window.close()
  if (window.opener) {
    window.opener = null;
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
        objectFit: "contain",
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

    // Close the current browser window/tab
    window.close();
    // Fallback for browsers that block window.close()
    if (window.opener) {
      window.opener = null;
    }
    isHandleClose.value = true;
  } catch (error) {
    console.error("Erro ao fechar a sala:", error);
  }
};
</script>

<style scoped>
.video-container {
  width: 100%;
  height: calc(100vh - 120px); /* Altura da viewport menos padding e margens */
  max-height: 80vh;
  min-height: 400px;
  overflow: hidden;
}

/* Garantir que o conteúdo do Zego se ajuste ao container */
.video-container :deep(.zego-uikit-prebuilt-call) {
  height: 100% !important;
  width: 100% !important;
}

.video-container :deep(.zego-uikit-prebuilt-call > div) {
  height: 100% !important;
  width: 100% !important;
}

/* Ajustar vídeos para caber no container */
.video-container :deep(video) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Container responsivo */
@media (max-width: 768px) {
  .video-container {
    height: calc(100vh - 60px);
    max-height: 90vh;
    min-height: 250px;
  }

  /* Garantir que os controles sejam visíveis em mobile */
  .video-container
    :deep(.zego-uikit-prebuilt-call .zego-uikit-prebuilt-call-toolbar) {
    position: fixed !important;
    bottom: 10px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 1000 !important;
    background: rgba(0, 0, 0, 0.7) !important;
    border-radius: 25px !important;
    padding: 8px 16px !important;
  }

  /* Ajustar botões dos controles */
  .video-container
    :deep(.zego-uikit-prebuilt-call .zego-uikit-prebuilt-call-toolbar button) {
    min-width: 44px !important;
    min-height: 44px !important;
    margin: 0 4px !important;
  }

  /* Garantir que o vídeo não sobreponha os controles */
  .video-container
    :deep(.zego-uikit-prebuilt-call .zego-uikit-prebuilt-call-video-view) {
    padding-bottom: 80px !important;
  }
}

/* Estilos específicos para telas muito pequenas */
@media (max-width: 480px) {
  .video-container {
    height: calc(100vh - 40px);
    max-height: 95vh;
    min-height: 200px;
  }

  /* Ajustar controles para telas muito pequenas */
  .video-container
    :deep(.zego-uikit-prebuilt-call .zego-uikit-prebuilt-call-toolbar) {
    bottom: 5px !important;
    padding: 6px 12px !important;
  }

  .video-container
    :deep(.zego-uikit-prebuilt-call .zego-uikit-prebuilt-call-toolbar button) {
    min-width: 40px !important;
    min-height: 40px !important;
    margin: 0 2px !important;
  }
}

/* Ajustes para orientação landscape em mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .video-container {
    height: calc(100vh - 20px);
    max-height: 98vh;
  }

  .video-container
    :deep(.zego-uikit-prebuilt-call .zego-uikit-prebuilt-call-toolbar) {
    bottom: 5px !important;
    padding: 4px 8px !important;
  }

  .video-container
    :deep(.zego-uikit-prebuilt-call .zego-uikit-prebuilt-call-toolbar button) {
    min-width: 36px !important;
    min-height: 36px !important;
  }
}

/* Garantir que elementos de UI sejam sempre visíveis */
.video-container :deep(.zego-uikit-prebuilt-call) {
  position: relative !important;
}

.video-container
  :deep(.zego-uikit-prebuilt-call .zego-uikit-prebuilt-call-header) {
  z-index: 999 !important;
}

/* Ajustar área de toque para melhor usabilidade mobile */
@media (max-width: 768px) {
  .video-container
    :deep(.zego-uikit-prebuilt-call .zego-uikit-prebuilt-call-toolbar button) {
    touch-action: manipulation !important;
    -webkit-tap-highlight-color: transparent !important;
  }
}
</style>
