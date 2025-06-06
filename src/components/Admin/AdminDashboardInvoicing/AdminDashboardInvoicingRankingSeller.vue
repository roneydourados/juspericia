<template>
  <Table
    title="Ranking Vendas por Vendedor"
    :headers="headers"
    :items="$salesSellers"
    class="elevation-1"
    :loading="!$salesSellers"
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
const $salesSellers = computed(
  () => userAdmin.$dashboardInvoicing?.salesSellers
);

const headers = [
  { title: "Vendedor", key: "seller" },
  { title: "Total", key: "total" },
];
</script>
