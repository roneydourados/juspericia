<template>
  <v-row dense class="pa-6">
    <v-col cols="12" class="mb-4">
      <HeaderPage title="Vídeos / tutoriais" font-size="1.8rem" />
    </v-col>
    <v-col v-for="item in 15" cols="12" lg="4" :key="item">
      <v-card rounded="xl" elevation="8" class="mx-auto">
        <div class="d-flex justify-center py-4">
          <video
            src="https://www.youtube.com/watch?v=RxOBOhRECoo"
            controls
            style="border-radius: 1rem"
          />
        </div>
        <v-card-text class="px-12 mb-4">
          <div class="text-primary text-h5">Serviço {{ item + 1 }}</div>
          <div class="text-primary text-caption mb-2">
            Dados informativos sobre o sistema
          </div>
          <div class="text-primary">
            Descrição detalhada do serviço prestado em questão no título deste
            card, todas as informações serão referente ao
            <strong>Serviço({{ item + 1 }})</strong>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import HeaderPage from "../UI/infos/HeaderPage.vue";
</script>
