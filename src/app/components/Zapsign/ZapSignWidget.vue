<template>
  <div class="zapsign-widget">
    <iframe
      :src="widgetUrl"
      frameborder="0"
      width="100%"
      allowfullscreen
      allow="camera"
    />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const emit = defineEmits<{
  (e: "doc-loaded"): void;
  (e: "doc-signed"): void;
  (e: "signed-file-ready"): void;
  (e: "error", payload: any): void;
  (e: "unknown-event", payload: string): void;
}>();

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
});

const widgetUrl = ref(`${config.public.zapSignUrl}/verificar/${props.token}`);
const signedReadyFired = ref(false);

const handleZapsignMessage = (event: MessageEvent) => {
  // Segurança: garante que o evento veio da Zapsign
  if (!event.origin.includes(new URL(config.public.zapSignUrl).hostname))
    return;

  const eventType = event.data;

  switch (eventType) {
    case "zs-doc-loaded":
      console.log("📄 Documento carregado no iframe");
      emit("doc-loaded");
      signedReadyFired.value = false; // reseta flag ao carregar novo doc
      break;

    case "zs-doc-signed":
      console.log("✅ Documento assinado com sucesso");
      emit("doc-signed");
      break;

    case "zs-signed-file-ready":
      if (signedReadyFired.value) {
        console.log("⚠️ Evento duplicado ignorado: zs-signed-file-ready");
        return;
      }
      signedReadyFired.value = true;
      console.log("📥 Documento assinado pronto para download");
      emit("signed-file-ready");
      break;

    default:
      console.log("📩 Evento desconhecido da Zapsign:", eventType);
      emit("unknown-event", eventType);
  }
};

onMounted(() => {
  console.log("url: ", `${config.public.zapSignUrl}/verificar/${props.token}`);
  window.removeEventListener("message", handleZapsignMessage); // evita duplicação
  window.addEventListener("message", handleZapsignMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener("message", handleZapsignMessage);
});
</script>

<style scoped>
.zapsign-widget iframe {
  border-radius: 8px;
  border: 1px solid #ccc;
  height: 80dvh;
}
</style>

<!-- <template>
  <div class="zapsign-widget">
    <iframe
      :src="widgetUrl"
      frameborder="0"
      width="100%"
      allowfullscreen
      allow="camera"
    />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const emit = defineEmits<{
  (e: "doc-loaded"): void;
  (e: "doc-signed"): void;
  (e: "signed-file-ready"): void;
  (e: "error", payload: any): void; // Para eventos que não sejam diretamente de sucesso/carregamento
  (e: "unknown-event", payload: string): void; // Para depuração de eventos desconhecidos
}>();

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
});

const widgetUrl = ref(`${config.public.zapSignUrl}/verificar/${props.token}`);

const handleZapsignMessage = (event: MessageEvent) => {
  const eventType = event.data; // event.data é a própria string do evento

  switch (eventType) {
    case "zs-doc-loaded":
      console.log("📄 Documento carregado no iframe");
      emit("doc-loaded");
      break;
    case "zs-doc-signed":
      console.log("✅ Documento assinado com sucesso");
      emit("doc-signed");
      break;
    case "zs-signed-file-ready":
      console.log("📥 Documento assinado pronto para download");
      emit("signed-file-ready");
      break;
    // Se a Zapsign enviar outros eventos no futuro (ex: cancelado, recusado)
    // eles provavelmente seguirão o mesmo padrão de string.
    // Você pode adicionar mais cases aqui conforme a documentação deles.
    default:
      console.log("📩 Evento desconhecido da Zapsign:", eventType);
      emit("unknown-event", eventType); // Emitir para depuração
  }
};

onMounted(() => {
  window.addEventListener("message", handleZapsignMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener("message", handleZapsignMessage);
});
</script>

<style scoped>
.zapsign-widget iframe {
  border-radius: 8px;
  border: 1px solid #ccc;
  height: 80dvh;
}
</style> -->
