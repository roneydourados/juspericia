<template>
  <LawyerMyIndications />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const indicationStore = useUserIndicationStore();
const auth = useAuthStore();

const loading = ref(false);

const $currentUser = computed(() => auth.$currentUser);

onMounted(async () => {
  loading.value = true;
  try {
    const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");

    const userId =
      $currentUser.value?.profile?.type !== "ADMIN"
        ? $currentUser.value?.id
        : undefined;

    await indicationStore.index({ initialDate, finalDate, userId });
  } finally {
    loading.value = false;
  }
});
</script>
