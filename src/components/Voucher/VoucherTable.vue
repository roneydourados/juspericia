<template>
  <div>
    <Table
      title="Vouchers"
      :headers="headers"
      :items="vounchers"
      :showCrud="false"
    >
      <template v-slot:top-table>
        <v-row dense>
          <v-col cols="12" lg="2">
            <DatePicker
              v-model="filters.initialDate"
              label="Data Inicial"
              variant="outlined"
              color="primary"
              hide-details
            />
          </v-col>
          <v-col cols="12" lg="2">
            <DatePicker
              v-model="filters.finalDate"
              label="Data Final"
              variant="outlined"
              color="primary"
              hide-details
            />
          </v-col>
          <v-col cols="12" lg="4">
            <SelectSearchMedic v-model="filters.seller" />
          </v-col>
          <v-col
            cols="12"
            lg="4"
            class="d-flex flex-wrap align-center justify-end mb-4"
            style="gap: 0.5rem"
          >
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              class="text-none"
              @click="getVouchers"
            >
              <v-icon icon="mdi-filter" start />
              Filtrar
            </v-btn>
            <v-btn
              variant="flat"
              color="info"
              class="text-none"
              size="small"
              @click="$router.back()"
            >
              <v-icon icon="mdi-arrow-left"> </v-icon>
              Voltar
            </v-btn>
            <v-btn
              variant="flat"
              color="primary"
              class="text-none"
              size="small"
              @click="hanelNewVoucher"
            >
              <v-icon icon="mdi-plus"> </v-icon>
              Novo
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.voucherName="{ item }">
        <v-chip color="success" text-color="white" label variant="flat">
          <strong>
            {{ item.voucherName }}
          </strong>
        </v-chip>
      </template>
      <template v-slot:item.discount="{ item }">
        {{ item.discountType === "percentage" ? "%" : "R$" }}
        {{ amountFormated(item.discount ?? 0, false) }}
      </template>
      <template v-slot:item.expirationDate="{ item }">
        {{ dayjs(item.expirationDate).format("DD/MM/YYYY HH:mm") }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="item.status === 'active' ? 'success' : 'error'"
          text-color="white"
          variant="flat"
        >
          {{ item.status === "active" ? "Ativo" : "Inativo" }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          color="orange"
          variant="text"
          size="small"
          @click="getItemEdit(item)"
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
        <v-btn icon color="error" variant="text" size="small">
          <v-icon icon="mdi-delete-outline" size="20"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Apagar
          </v-tooltip>
        </v-btn>
      </template>
    </Table>
    <VoucherForm v-model="showForm" :data="selected" />
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const { amountFormated } = useUtils();
const voucher = useVoucherStore();
const consultationPackageStore = useServicePackageStore();

const showForm = ref(false);
const loading = ref(false);
const selected = ref<VoucherFormProps>();
const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  status: "active",
  seller: undefined as UserProps | undefined,
});
const headers = [
  { title: "Nome/Código", key: "voucherName" },
  { title: "Descrição", key: "description" },
  { title: "Desconto", key: "discount" },
  { title: "Data de Expiração", key: "expirationDate" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions" },
];

const vounchers = computed(() => voucher.$all);

const getItemEdit = async (item: VoucherFormProps) => {
  loading.value = true;
  try {
    await consultationPackageStore.index("active");
    selected.value = item;
    showForm.value = true;
  } finally {
    loading.value = false;
  }
};

const hanelNewVoucher = async () => {
  loading.value = true;
  try {
    await consultationPackageStore.index("active");
    selected.value = undefined;
    showForm.value = true;
  } finally {
    loading.value = false;
  }
};

const getVouchers = async () => {
  loading.value = true;
  try {
    await voucher.index(filters.value);
  } catch (error) {
    console.error("Error fetching vouchers:", error);
  } finally {
    loading.value = false;
  }
};
</script>
