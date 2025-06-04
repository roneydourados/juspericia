<template>
  <Table
    title="Ranking Vendas por cliente"
    :headers="headers"
    :items="$salesClient"
    class="elevation-1"
    :loading="!$salesClient"
    :show-crud="false"
  >
    <template v-slot:item.total="{ item }">
      <span class="text-subtitle-1 font-weight-bold">
        {{ amountFormated(item.total ?? 0, false) }}
      </span>
    </template>
  </Table>
</template>

<script setup lang="ts">
const userAdmin = useUserAdminStore();
const { amountFormated } = useUtils();
const $salesClient = computed(
  () => userAdmin.$dashboardInvoicing?.salesClients
);

const headers = [
  { title: "Cliente", key: "client" },
  { title: "Total", key: "total" },
];
</script>
