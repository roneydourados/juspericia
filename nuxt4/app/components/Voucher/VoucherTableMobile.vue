<template>
  <div class="d-flex justify-end align-center mb-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      :total-visible="PAGINATION_TOTAL_VISIBLE"
      color="primary"
      rounded="circle"
      density="comfortable"
    />
    <span class="text-caption text-primary">
      Pg. {{ page }} de {{ pageCount }}
    </span>
  </div>

  <CardBlur
    v-for="item in paginatedItems"
    :key="item.id"
    class="mb-2 text-primary"
    :hover="false"
    style="border-top: 3px solid #c8e040"
    height="280"
  >
    <template #title>
      <div>Dados do Voucher</div>
    </template>
    <template #content>
      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between align-center">
          <span>Código:</span>
          <strong>{{ item.voucherName }}</strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span>Desconto:</span>
          <strong>
            {{ item.discountType === "percentage" ? "%" : "R$" }}
            {{ amountFormated(Number(item.discount ?? 0), false) }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span>Expira:</span>
          <strong>
            {{ dayjs(item.expirationDate).format("DD/MM/YYYY HH:mm") }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span>Qtde Liberada:</span>
          <strong>
            {{ item.useQuantity }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span>Qtde Utilizada:</span>
          <strong>
            {{ item.voucherUseCount ?? 0 }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span>Status:</span>
          <v-chip
            :color="getItemStatus(item).color"
            text-color="white"
            variant="flat"
          >
            {{ getItemStatus(item).status }}
          </v-chip>
        </div>

        <v-divider class="mt-4"></v-divider>
      </div>
    </template>
    <template #actions>
      <div
        class="d-flex align-center justify-end mt-n8 w-100"
        style="gap: 0.5rem"
      >
        <v-btn
          icon
          color="colorIcon"
          variant="text"
          size="small"
          @click="emit('edit', item)"
        >
          <v-icon icon="mdi-pencil-outline" size="20"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Editar
          </v-tooltip>
        </v-btn>
        <v-btn
          icon
          color="red"
          variant="text"
          size="small"
          @click="emit('delete', item)"
        >
          <v-icon icon="mdi-delete-outline" size="20"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Apagar
          </v-tooltip>
        </v-btn>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { length } from "zod";

const emit = defineEmits(["edit", "delete", "search", "add", "info"]);
const voucher = useVoucherStore();
const { amountFormated } = useUtils();

const $all = computed(() => voucher.$all);

const itemsPerPage = ref(10);
const page = ref(1);
const search = ref("");
const paginatedItems = computed(() => {
  const all = $all.value || [];
  const start = (page.value - 1) * itemsPerPage.value;
  return all.slice(start, start + itemsPerPage.value);
});

const pageCount = computed(() => {
  const all = $all.value || [];

  if (all.length === 0) return all.length;

  return Math.ceil(all.length / itemsPerPage.value);
});

const getItemStatus = (item: VoucherFormProps) => {
  if (
    Number(item.useQuantity ?? 0) === Number(item.voucherUseCount ?? 0) &&
    item.status !== "deleted"
  ) {
    return {
      status: "Utilizado",
      color: "warning",
    };
  }

  if (dayjs(item.expirationDate).isBefore(dayjs())) {
    return {
      status: "Expirado",
      color: "error",
    };
  }

  if (item.status === "active") {
    return {
      status: "Ativo",
      color: "success",
    };
  }

  if (item.status === "deleted") {
    return {
      status: "Inativo",
      color: "warning",
    };
  }

  return {
    status: "Desconhecido",
    color: "grey",
  };
};
</script>
