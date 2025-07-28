<template>
  <DialogForm
    :show="show"
    title="QRCode Pix"
    width="400"
    @dialog="show = false"
  >
    <v-card rounded="lg" flat>
      <v-card-text>
        <div class="text-center">
          <h3 class="mb-2">Escaneie com o app do banco</h3>
          <v-img
            v-if="qrCodeDataUrl"
            :src="qrCodeDataUrl"
            max-width="250"
            class="mx-auto"
          />
          <div v-else>
            <v-progress-circular indeterminate color="primary" />
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex flex-column" style="gap: 0.5rem">
          <v-btn
            variant="flat"
            color="primary"
            class="text-none"
            size="small"
            @click="handleCopyPaste"
            prepend-icon="mdi-content-copy"
            block
          >
            Copiar código PIX
          </v-btn>
          <v-btn
            variant="flat"
            color="success"
            class="text-none"
            size="small"
            @click="handleConfirm"
            prepend-icon="mdi-check-all"
            block
          >
            Confirmar pagamento
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </DialogForm>
</template>

<script setup lang="ts">
import { QrCodePix } from "qrcode-pix";

const props = defineProps({
  parameters: {
    type: Object as () => IQRCodeParameter,
    defalt: () => ({
      version: "01",
      key: "",
      name: "",
      city: "",
      value: 0,
      message: "",
    }),
  },
});

const emit = defineEmits(["confirm"]);

const show = defineModel({
  default: false,
});

const qrCode = ref<IQRCodeResponse | null>(null);
const qrCodeDataUrl = ref<string | null>(null);
const qrCodeCopyPaste = ref<string | null>(null);

const gerarQRCode = async () => {
  qrCode.value = QrCodePix({
    version: props.parameters!.version,
    key: props.parameters!.key, //or any PIX key
    name: props.parameters!.name,
    city: props.parameters!.city,
    //transactionId: "YOUR_TRANSACTION_ID", //max 25 characters
    message: props.parameters!.message || "Pagamento via PIX",
    //cep: "99999999",
    value: props.parameters!.value,
  });

  try {
    qrCodeCopyPaste.value = qrCode.value.payload();
    qrCodeDataUrl.value = await qrCode.value.base64();
  } catch (err) {
    console.error("Erro ao gerar QR Code Pix:", err);
  }
};

const handleCopyPaste = () => {
  if (qrCodeCopyPaste.value) {
    navigator.clipboard
      .writeText(qrCodeCopyPaste.value)
      .then(() => {
        push.success("Texto copiado para a área de transferência");
      })
      .catch((err) => {
        push.error("Opps! Erro ao copiar texto, tente novamente.");
      });
  }
};

const handleConfirm = () => {
  emit("confirm");
  show.value = false;
};

onMounted(gerarQRCode);

watch(
  () => [
    props.parameters!.key,
    props.parameters!.name,
    props.parameters!.city,
    props.parameters!.value,
    props.parameters!.message,
  ],
  () => {
    qrCodeDataUrl.value = null; // Reset QR code data URL when parameters change
    gerarQRCode();
  }
);
</script>
