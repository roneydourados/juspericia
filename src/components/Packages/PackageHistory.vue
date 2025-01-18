<template>
  <DialogForm
    :show="show"
    title="Detalhes"
    @dialog="show = false"
    :width="mobile ? '100%' : '80%'"
  >
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <Table
              :headers="headers"
              :items="$history"
              :show-crud="false"
              title="Histórico"
            >
              <template #item.createdAt="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ moment(item.createdAt).format("DD/MM/YYYY HH:mm") }}
                </strong>
              </template>
              <template #item.description="{ item }">
                <span>
                  {{ item.description }}
                </span>
              </template>
              <template #item.action="{ item }">
                <span>
                  {{ getActionName(item.action) }}
                </span>
              </template>
              <template #item.User="{ item }">
                <span>
                  {{ item.User.name }}
                </span>
              </template>
            </Table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

import moment from "moment";
const show = defineModel({
  default: false,
});

const consutationPackage = useServicePackageStore();
const { amountFormated } = useUtils();
const { mobile } = useDisplay();

const $history = computed(() => consutationPackage.$history);
const headers = ref([
  {
    title: "Data",
    key: "createdAt",
    width: "20%",
  },
  {
    title: "Histórico",
    key: "description",
  },
  {
    title: "Ação",
    key: "action",
  },
  {
    title: "Usuário",
    key: "User",
  },
]);

const getActionName = (action: string) => {
  switch (action) {
    case "create":
      return "Inclusão";
    case "update":
      return "Atualização";
    case "deleted":
      return "Exclusão";
    default:
      return "Indefinido";
  }
};
</script>
