<template>
  <v-card>
    <v-card-title>
      <v-row dense>
        <v-col cols="12" lg="11">
          <span>Detalhes solicitação</span>
        </v-col>
        <v-col cols="12" lg="1">
          <v-btn
            class="text-none"
            prepend-icon="mdi-arrow-left"
            flat
            color="primary"
            size="small"
            @click="$router.back()"
          >
            Voltar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
  </v-card>
</template>

<script setup lang="ts"></script>
