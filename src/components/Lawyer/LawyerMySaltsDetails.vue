<template>
  <DialogForm :show="show" title="Detalhes" @dialog="show = false" width="60%">
    <v-card flat>
      <v-card-title>
        <div class="d-flex align-center justify-space-between w-100">
          <span>
            {{ $single?.description }}
          </span>
          <span>
            Expira em:
            <strong>
              {{ moment($single?.expiredAt).format("DD/MM/YYYY") }}
            </strong>
          </span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" class="d-flex justify-end">
            <div
              v-for="payment in $single?.UserCreditPayment"
              class="d-flex flex-column w-25"
            >
              <strong>Formas de pagamento</strong>
              <div class="d-flex align-center justify-space-between w-100 mt-2">
                <span>
                  {{ payment.paymentForm }}
                </span>
                <strong>
                  {{ amountFormated(payment.value ?? 0, false) }}
                </strong>
              </div>
              <v-divider></v-divider>
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <Table
              :headers="headers"
              :items="$single?.UserLogCredit"
              :show-crud="false"
              title="Histórico"
            >
              <template #item.createdAt="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ moment(item.createdAt).format("DD/MM/YYYY HH:mm") }}
                </strong>
              </template>
              <template #item.history="{ item }">
                <span style="font-size: 0.7rem">
                  {{ item.history }}
                </span>
              </template>
              <template #item.oldValue="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ amountFormated(item.oldValue, false) }}
                </strong>
              </template>
              <template #item.inputValue="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ amountFormated(item.inputValue, false) }}
                </strong>
              </template>
              <template #item.outputValue="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ amountFormated(item.outputValue, false) }}
                </strong>
              </template>
              <template #item.saltValue="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ amountFormated(item.saltValue ?? 0, false) }}
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
import moment from "moment";
const show = defineModel({
  default: false,
});

const saltCredit = useUserCreditSaltStore();
const { amountFormated } = useUtils();

const $single = computed(() => saltCredit.$single);

const headers = ref([
  {
    title: "Data",
    key: "createdAt",
    width: "15%",
  },
  {
    title: "Histórico",
    key: "history",
  },
  {
    title: "Anterior",
    key: "oldValue",
  },
  {
    title: "Entrada",
    key: "inputValue",
  },
  {
    title: "Saída",
    key: "outputValue",
  },
  {
    title: "Saldo",
    key: "saltValue",
  },
]);
</script>
