<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    :width="mobile ? '100%' : '70%'"
    style="overflow: hidden"
  >
    <v-card rounded="lg" style="overflow: hidden">
      <v-toolbar>
        <v-toolbar-title>
          <div class="text-subtitle-1 font-weight-bold">Detalhes do laudo</div>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="handleClose" variant="text">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <ZapSignWidget :token="token" @signed-file-ready="handleDocAssinado" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const zapsignStore = useZapsignStore();

const { mobile } = useDisplay();
const emit = defineEmits(["close"]);

const report = defineModel<PatientConsultationReportListProps>("report", {
  default: () => ({}),
});

const dialog = defineModel("dialog", {
  default: false,
  type: Boolean,
});

const token = defineModel("token", {
  default: "",
  type: String,
});

const handleClose = () => {
  emit("close");
  dialog.value = false;
};

const handleDocAssinado = async () => {
  try {
    await zapsignStore.updateReportToSigned({
      publicId: report.value.reportPublicId,
      signStatus: "signed",
    });

    console.log("foi enviado para api assinar o laudo");
  } catch (error) {
    console.error("Erro ao atualizar o laudo para assinado:", error);
  } finally {
    handleClose();
  }
};
</script>
