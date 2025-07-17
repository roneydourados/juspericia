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
</style>

<!-- <template>
  <div class="zapsign-widget">
    <iframe
      :src="widgetUrl"
      frameborder="0"
      width="100%"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const emit = defineEmits<{
  (e: "signed", payload: any): void;
  (e: "error", payload: any): void;
  (e: "closed"): void;
}>();

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
});

const widgetUrl = ref(`${config.public.zapSignUrl}/${props.token}`);

const handleZapsignMessage = (event: MessageEvent) => {
  const { event_type, data } = event.data || {};

  switch (event_type) {
    case "document_signed":
      console.log("📄 Documento assinado:", data);
      emit("signed", data);
      break;
    case "document_declined":
      console.warn("❌ Documento recusado:", data);
      emit("error", data);
      break;
    case "widget_closed":
      console.info("🔒 Widget fechado");
      emit("closed");
      break;
    default:
      console.log("📩 Evento desconhecido da Zapsign:", event_type, data);
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
