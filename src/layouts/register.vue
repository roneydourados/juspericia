<template>
  <v-app>
    <!-- <v-app-bar>
      <template #title>
        <Logo height="30" />
      </template>
      <v-spacer></v-spacer>
    </v-app-bar> -->

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
<script setup lang="ts"></script>

<style scoped></style>
