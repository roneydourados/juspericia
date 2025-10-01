<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
    <v-card flat rounded="lg">
      <div class="pa-6 font-weight-bold" style="font-size: 1.2rem">
        Dados laudo médico
      </div>
      <MedicalReportForm @close="handleClose" />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);
const dialog = defineModel({ default: false });

const handleClose = () => {
  emit("close");
  dialog.value = false;
};
</script>
