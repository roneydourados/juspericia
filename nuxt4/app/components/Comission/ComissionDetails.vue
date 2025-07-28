<template>
  <DialogForm
    :show="show"
    title="Detalhes da comissão"
    @dialog="show = false"
    :width="mobile ? '100%' : '80%'"
  >
    <v-row dense>
      <v-col cols="12" lg="5">
        <InfoLabel
          title="Beneficiário"
          font-size="1"
          :content="`${$single?.user?.name}`"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="Base comissão"
          font-size="1"
          :content="`${amountFormated($single?.comissionBase ?? 0, false)}`"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          title="%Comissão"
          font-size="1"
          :content="`${amountFormated(
            $single?.comissionPercentage ?? 0,
            false
          )}`"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          title="Valor comissão"
          font-size="1"
          :content="`${amountFormated($single?.comissionValue ?? 0, false)}`"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          title="Tipo comissão"
          font-size="1"
          :content="`${getComissionType($single?.comissionType ?? '')}`"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          title="Status comissão"
          font-size="1"
          :content="`${getComisstionStatus($single?.comissionStatus ?? '')}`"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="Categoria comissão"
          font-size="1"
          :content="`${getComisstionCategory(
            $single?.comissionCategory ?? ''
          )}`"
        />
      </v-col>
      <v-col cols="12" class="mt-4">
        <strong>Observações</strong>
      </v-col>
      <v-col cols="12">
        <div>{{ $single?.comissionObservation }}</div>
      </v-col>
    </v-row>
    <Table
      :headers="headers"
      :items="$single?.histories"
      :show-crud="false"
      title="Histórico"
    >
      <template v-slot:item.createdAt="{ item }">
        <span>{{ dayjs(item.createdAt).format("DD/MM/YYYY HH:mm") }}</span>
      </template>
    </Table>
    <!-- <pre>{{ $single }}</pre> -->
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
const comission = useComissionStore();
const { mobile } = useDisplay();
const { amountFormated, formatDate } = useUtils();

const show = defineModel({
  default: false,
});

const headers = ref([
  { title: "Data", key: "createdAt", width: "12%" },
  { title: "Histórico", key: "observation" },
]);

const $single = computed(() => comission.$single);

const getComissionType = (type: string) => {
  switch (type) {
    case "seller":
      return "Vendedor";
    case "medic":
      return "Médico";
    default:
      return "Desconhecido";
  }
};

const getComisstionStatus = (status: string) => {
  switch (status) {
    case "paid":
      return "Pago";
    case "pending":
      return "Pendente";
    case "cancel":
      return "Cancelado";
    default:
      return "Desconhecido";
  }
};

const getComisstionCategory = (category: string) => {
  switch (category) {
    case "sale-package":
      return "Venda de Pacote";
    case "sale":
      return "Venda";
    case "sale-solicitation":
      return "Venda de Solicitação";
    default:
      return "Desconhecido";
  }
};
</script>
