<template>
  <DialogForm
    :show="show"
    title="Detalhes"
    @dialog="show = false"
    :width="mobile ? '100%' : '80%'"
    border-color="#c8e040"
  >
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <Table
              :headers="headers"
              :items="$single"
              :show-crud="false"
              title="Histórico"
            >
              <template #item.createdAt="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ dayjs(item.createdAt).format("DD/MM/YYYY HH:mm") }}
                </strong>
              </template>
              <template #item.history="{ item }">
                <span>
                  {{ item.history }}
                </span>
              </template>
              <template #item.type="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ item.type === "D" ? "Débito" : "Crédito" }}
                </strong>
              </template>
              <template #item.value="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ amountFormated(item.value, false) }}
                </strong>
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

import dayjs from "dayjs";
const show = defineModel({
  default: false,
});

const saltCredit = useUserCreditSaltStore();
const { amountFormated } = useUtils();
const { mobile } = useDisplay();

const $single = computed(() => saltCredit.$userCreditLog);
const headers = ref([
  {
    title: "Data",
    key: "createdAt",
    width: "20%",
  },
  {
    title: "Histórico",
    key: "history",
  },
  {
    title: "Tipo",
    key: "type",
  },
  {
    title: "Valor",
    key: "value",
  },
]);
</script>
