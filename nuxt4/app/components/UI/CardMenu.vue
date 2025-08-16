<template>
  <v-row>
    <v-col v-for="(item, index) in cardItems" :key="index" cols="12" lg="4">
      <v-card
        elevation="12"
        rounded="xl"
        class="pa-4"
        height="100%"
        @click="handleClickService(item.to)"
      >
        <div class="d-flex flex-column align-center">
          <v-avatar size="60" color="colorIcon">
            <v-icon :icon="item.icon" size="32" color="white" />
          </v-avatar>
          <v-card-title>
            <span
              class="font-weight-bold text-primary"
              style="font-size: 1.2rem"
            >
              {{ item.title }}
            </span>
          </v-card-title>
          <p class="text-subtitle-2 text-darkText text-center">
            {{ item.subtitle }}
          </p>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps({
  cardItems: {
    type: Array as PropType<CardMenuProps[]>,
    default: () => [],
  },
});
const router = useRouter();

const handleClickService = async (route: string) => {
  await router.push(route);
};
</script>
