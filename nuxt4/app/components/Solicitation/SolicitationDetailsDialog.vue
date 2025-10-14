<template>
  <DialogForm :show="show" title="" fullscreen @dialog="show = false">
    <SolicitationDetails :show-voltar="false" />
  </DialogForm>
</template>

<script setup lang="ts">
const show = defineModel("show", {
  default: false,
});
</script>
