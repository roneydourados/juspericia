<template>
  <div class="zapsign-widget">
    <!-- <pre>url: {{ widgetUrl }}</pre> -->
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

/**
 * Listener dos eventos enviados pelo iframe Zapsign via postMessage
 */
const handleZapsignMessage = (event: MessageEvent) => {
  // Confirma que é a origem da Zapsign
  // const allowedOrigins = ["https://secure.zapsign.com.br"];
  // if (!allowedOrigins.includes(event.origin)) return;

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
</style>
