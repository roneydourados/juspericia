<template>
  <v-card flat width="100%">
    <v-card-title>
      <div class="d-flex justify-end w-100 px-12">
        <strong class="text-primary"> Versão: {{ $single?.version }} </strong>
      </div>
    </v-card-title>
    <v-card-text class="px-12">
      <div v-html="$single?.content" class="tiptap-content" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// import { useDisplay } from "vuetify";
definePageMeta({
  title: "Termos de Serviço",
  description: "Termos de Serviço",
  middleware: undefined,
  layout: "empty",
});

const termsStore = useTermsStore();
const $single = computed(() => termsStore.$single);

onMounted(async () => {
  await termsStore.getLastTerm("terms_of_use");
});
</script>

<style scoped></style>
