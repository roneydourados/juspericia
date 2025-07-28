<template>
  <div>
    <Table
      title="Vouchers"
      :headers="headers"
      :items="vounchers"
      :showCrud="false"
    >
      <template v-slot:top-table>
        <v-row dense class="mt-4">
          <v-col
            cols="12"
            lg="3"
            class="d-flex align-center mt-n5"
            style="gap: 0.5rem"
          >
            <DatePicker
              v-model="filters.initialDate"
              label="Data Inicial"
              variant="outlined"
              color="primary"
              hide-details
            />
            <DatePicker
              v-model="filters.finalDate"
              label="Data Final"
              variant="outlined"
              color="primary"
              hide-details
            />
          </v-col>
          <v-col cols="12" lg="3">
            <SelectSearchLawyer label="Cliente" v-model="filters.user" />
          </v-col>
          <v-col cols="12" lg="2">
            <SelectInput
              label="Status"
              v-model="filters.status"
              item-title="text"
              item-value="value"
              :items="[
                {
                  text: 'Ativo',
                  value: 'active',
                },
                { text: 'Inativo', value: 'deleted' },
              ]"
              @update:model-value="getVouchers"
            />
          </v-col>
          <v-col
            cols="12"
            lg="4"
            class="d-flex flex-wrap align-center mb-4"
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
              @click="router.back()"
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
        <v-chip
          color="success"
          text-color="white"
          label
          variant="flat"
          @click="handleCopy(item.voucherName)"
        >
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
          :color="getItemStatus(item).color"
          text-color="white"
          variant="flat"
        >
          {{ getItemStatus(item).status }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          color="orange"
          variant="text"
          size="small"
          @click="getItemEdit(item)"
          :disabled="getItemStatus(item).status !== 'Ativo'"
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
          color="error"
          variant="text"
          size="small"
          @click="getItemDelete(item)"
          :disabled="getItemStatus(item).status !== 'Ativo'"
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
      </template>
    </Table>
    <VoucherForm v-model="showForm" :data="selected" />
    <DialogLoading :dialog="loading" />
    <Dialog
      title="CONFIRME"
      :dialog="showDeleteVoucher"
      @cancel="showDeleteVoucher = false"
      @confirm="handleDeleteItem"
      show-cancel
    >
      <span>Conforma o cancelamento da transação ? </span>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const { amountFormated } = useUtils();
const voucher = useVoucherStore();
const consultationPackageStore = useServicePackageStore();
const router = useRouter();

const showForm = ref(false);
const loading = ref(false);
const showDeleteVoucher = ref(false);
const selected = ref<VoucherFormProps>();
const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  status: "active",
  seller: undefined as UserProps | undefined,
  user: undefined as UserProps | undefined,
});
const headers = [
  { title: "Nome/Código", key: "voucherName" },
  { title: "Descrição", key: "description" },
  { title: "Desconto", key: "discount" },
  { title: "Data de Expiração", key: "expirationDate" },
  { title: "Qtde liberada", key: "useQuantity" },
  { title: "Qtde Utilizada", key: "voucherUseCount" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions" },
];

const vounchers = computed(() => voucher.$all);

const getItemEdit = async (item: VoucherFormProps) => {
  loading.value = true;
  try {
    await consultationPackageStore.index({ name: "", status: "active" });
    selected.value = item;
    showForm.value = true;
  } finally {
    loading.value = false;
  }
};

const getItemDelete = (item: VoucherFormProps) => {
  loading.value = true;
  try {
    selected.value = item;
    showDeleteVoucher.value = true;
  } finally {
    loading.value = false;
  }
};

const hanelNewVoucher = async () => {
  loading.value = true;
  try {
    await consultationPackageStore.index({ name: "", status: "active" });
    selected.value = undefined;
    showForm.value = true;
  } finally {
    loading.value = false;
  }
};

const getVouchers = async () => {
  loading.value = true;
  try {
    await voucher.index({
      initialDate: filters.value.initialDate,
      finalDate: filters.value.finalDate,
      status: filters.value.status,
      sellerId: filters.value.seller
        ? String(filters.value.seller.id)
        : undefined,
      userId: filters.value.user ? String(filters.value.user.id) : undefined,
    });
  } catch (error) {
    console.error("Error fetching vouchers:", error);
  } finally {
    loading.value = false;
  }
};

const handleCopy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      push.success("Texto copiado para a área de transferência");
    })
    .catch((err) => {
      push.error("Erro ao copiar texto: " + err);
    });
};

const handleDeleteItem = async () => {
  if (!selected.value) {
    push.warning("Selecione um voucher para excluir.");
    return;
  }

  loading.value = true;
  try {
    await voucher.destroy(selected.value.publicId!);
    await getVouchers();
  } catch (error) {
    console.error("Error deleting voucher:", error);
  } finally {
    showDeleteVoucher.value = false;
    loading.value = false;
  }
};

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
