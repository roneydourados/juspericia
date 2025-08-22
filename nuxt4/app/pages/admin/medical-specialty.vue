<template>
  <MedicalSpecialtyTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const loading = ref(false);
const storeMedicalSpecialty = useMedicalSpecialtyStore();

onMounted(async () => {
  loading.value = true;
  try {
    await storeMedicalSpecialty.index("");
  } finally {
    loading.value = false;
  }
});
</script>
