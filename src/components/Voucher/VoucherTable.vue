<template>
  <div>
    <Table
      title="Vouchers"
      :headers="headers"
      :items="vounchers"
      :showCrud="true"
    >
      <template v-slot:item.discount="{ item }">
        {{ item.discountType === "percentage" ? "%" : "R$" }}
        {{ amountFormated(item.discount ?? 0, false) }}
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const { amountFormated } = useUtils();
const headers = [
  { title: "Código", key: "code" },
  { title: "Descrição", key: "description" },
  { title: "Desconto", key: "discount" },
  //{ title: "Tipo de Desconto", key: "discountType" },
  { title: "Data de Expiração", key: "expirationDate" },
  { title: "Status", key: "status" },
];

const vounchers = [
  {
    id: 1,
    code: "VOUCHER123",
    description: "Desconto de 10%",
    discount: 10,
    discountType: "percentage",
    expirationDate: dayjs().add(3, "day").format("DD/MM/YYYY HH:mm"),
    status: "active",
  },
  {
    id: 2,
    code: "VOUCHER456",
    description: "Desconto de R$20",
    discount: 20,
    discountType: "fixed",
    expirationDate: dayjs().add(2, "day").format("DD/MM/YYYY HH:mm"),
    status: "expired",
  },
  {
    id: 3,
    code: "VOUCHER789",
    description: "Desconto de 15%",
    discount: 15,
    discountType: "percentage",
    expirationDate: dayjs().add(5, "day").format("DD/MM/YYYY HH:mm"),
    status: "active",
  },
  {
    id: 4,
    code: "VOUCHER321",
    description: "Desconto de R$50",
    discount: 50,
    discountType: "fixed",
    expirationDate: dayjs().add(6, "day").format("DD/MM/YYYY HH:mm"),
    status: "inactive",
  },
  {
    id: 5,
    code: "VOUCHER654",
    description: "Desconto de 5%",
    discount: 5,
    discountType: "percentage",
    expirationDate: dayjs().add(3, "day").format("DD/MM/YYYY HH:mm"),
    status: "active",
  },
  {
    id: 6,
    code: "VOUCHER987",
    description: "Desconto de R$100",
    discount: 100,
    discountType: "fixed",
    expirationDate: dayjs().add(30, "day").format("DD/MM/YYYY HH:mm"),
    status: "active",
  },
];
</script>
