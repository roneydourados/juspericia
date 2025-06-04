<template>
  <Table
    title="Ranking Vendas geral"
    :headers="headers"
    :items="$salesGeral"
    class="elevation-1"
    :loading="!$salesGeral"
    :show-crud="false"
  >
    <template v-slot:item.total="{ item }">
      <span class="text-subtitle-1 font-weight-bold">
        {{ amountFormated(item.total ?? 0, false) }}
      </span>
    </template>
    <template v-slot:item.dateCreated="{ item }">
      <span class="text-subtitle-1 font-weight-bold">
        {{ formatDate(item.dateCreated) }}
      </span>
    </template>
  </Table>
</template>

<script setup lang="ts">
const userAdmin = useUserAdminStore();
const { amountFormated, formatDate } = useUtils();
const $salesGeral = computed(() => userAdmin.$dashboardInvoicing?.salesGeral);

const headers = [
  { title: "Cliente", key: "client" },
  { title: "Data", key: "dateCreated" },
  { title: "Descrição", key: "description" },
  { title: "Forma Pgto", key: "billingType" },
  { title: "Total", key: "total" },
];
</script>
