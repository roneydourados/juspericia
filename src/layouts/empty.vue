<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-app-bar
        elevation="0"
        color="primary"
        title="Application bar"
      ></v-app-bar>

      <v-main
        class="d-flex align-center justify-center"
        style="min-height: 300px"
      >
        <slot />
      </v-main>
    </v-layout>
  </v-app>
</template>
<script setup lang="ts"></script>

<style scoped></style>
