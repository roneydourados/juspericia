<template>
  <div>Cofre de senhas</div>
  <pre>{{ $all }}</pre>
</template>

<script setup lang="ts">
const passwordVaultStore = usePasswordVaultStore();

onMounted(async () => {
  await passwordVaultStore.index("");
});

const $all = computed(() => passwordVaultStore.$all);
</script>
