<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-app-bar elevation="0" color="primary">
        <template #title>
          <Logo height="30" />
        </template>
      </v-app-bar>

      <v-main class="d-flex align-center justify-center">
        <div class="w-100">
          <slot />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>
<script setup lang="ts"></script>

<style scoped></style>
