<template>
  <v-row dense justify="center">
    <v-col v-for="item in 4" cols="12" lg="3" :key="item">
      <v-card
        class="mx-auto"
        subtitle="Dados informativos sobre o sistema"
        :title="`Serviço ${item + 1}`"
        @click="handleClickService"
        min-height="250"
        rounded="lg"
        elevation="8"
      >
        <template #append>
          <v-icon icon="mdi-face-agent" size="40" color="info" />
        </template>
        <v-card-text>
          <div>
            Descrição detalhada do serviço prestado em questão no título deste
            card, todas as informações serão referente ao
            <strong>Serviço({{ item + 1 }})</strong>
          </div>
          <!-- <div class="d-flex justify-center py-4">
            <video
              src="https://www.youtube.com/watch?v=RxOBOhRECoo"
              controls
            ></video>
          </div> -->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const handleClickService = () => {
  push.success("Serviço clicado");
};
</script>
