<template>
  <v-row dense>
    <v-col v-for="item in 5" cols="12" lg="4" :key="item">
      <v-card
        class="mx-auto"
        subtitle="Dados informativos sobre o sistema"
        :title="`Serviço ${item + 1}`"
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
          <div class="d-flex justify-center py-4">
            <video
              src="https://www.youtube.com/watch?v=RxOBOhRECoo"
              controls
            ></video>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts"></script>
