<template>
  <div class="pa-12">
    <v-row>
      <v-col cols="12" class="pa-6">
        <HeaderPage title="Relatórios" font-size="1.8rem" />
      </v-col>
      <v-col v-for="(item, index) in itemsMenu" :key="index" cols="12" lg="4">
        <CardBlur @click="handlClick(item.to)" height="100%">
          <template #content>
            <div class="d-flex flex-column">
              <v-avatar size="60" color="colorIcon" class="mb-2 ml-4">
                <v-icon :icon="item.icon" size="32" color="white" />
              </v-avatar>

              <p class="text-subtitle-2 text-darkText px-6">
                {{ item.text }}
              </p>
            </div>
          </template>
        </CardBlur>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const itemsMenu = ref([
  {
    to: "/reports/patient-consultation",
    icon: "mdi-file-document-edit-outline",
    text: "Relatório de solicitações de consulta",
  },
]);

const handlClick = async (route: string) => {
  await router.push(route);
};
</script>
