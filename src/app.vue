<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
