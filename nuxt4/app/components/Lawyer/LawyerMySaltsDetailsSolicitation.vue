<template>
  <DialogForm title="" fullscreen :show="show" @dialog="show = false">
    <SolicitationDetails :show-voltar="false" />
  </DialogForm>
</template>

<script setup lang="ts">
const show = defineModel({
  default: false,
});
</script>
