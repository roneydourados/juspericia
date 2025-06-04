<template>
  <Card height="300">
    <template #title>
      <span class="font-weight-bold text-subtitle-1">
        Total de Vendas do período
      </span>
    </template>
    <template #content>
      <div class="d-flex justify-center align-center" style="height: 240px">
        <span class="text-h4 font-weight-bold">
          {{ $total ? amountFormated($total.total ?? 0, true) : "R$ 0,00" }}
        </span>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
const userAdmin = useUserAdminStore();
const { amountFormated } = useUtils();
const $total = computed(() => userAdmin.$dashboardInvoicing?.totalSales);
</script>
