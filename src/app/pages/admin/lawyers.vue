<template>
  <LawyerTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const userLawyerStore = useUserLawyerStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await userLawyerStore.index("");
  } finally {
    loading.value = false;
  }
});
//await useAsyncData(async () => await userLawyerStore.index(""));
</script>
