<template>
  <div>
    <Table
      title="Despesas"
      font-size="1.5rem"
      :items="filteredItems"
      :headers="headers"
      :loading="loading"
      @search="handleSearch"
      @add="openCreate"
      :show-crud="false"
    >
      <template #filters>
        <v-col cols="12" lg="2"
          ><DatePicker
            v-model="filters.initialDate"
            label="Data inicial"
            clearable
        /></v-col>
        <v-col cols="12" lg="2"
          ><DatePicker v-model="filters.finalDate" label="Data final" clearable
        /></v-col>
        <v-col cols="12" lg="3"
          ><SelectInput
            v-model="filters.status"
            label="Status"
            item-title="name"
            item-value="type"
            :items="statusItems"
            clearable
        /></v-col>
        <v-col
          cols="12"
          lg="3"
          class="d-flex flex-wrap mt-n6"
          style="gap: 0.5rem"
        >
          <Button
            color="primary"
            variant="flat"
            size="small"
            class="text-none"
            @click="handleFilter"
            ><v-icon icon="mdi-filter-outline" start /><span
              class="text-caption"
              >Filtrar</span
            ></Button
          >
          <Button
            color="grey"
            variant="outlined"
            size="small"
            class="text-none"
            @click="handleClear"
            ><v-icon icon="mdi-filter-remove-outline" start /><span
              class="text-caption"
              >Limpar</span
            ></Button
          >
          <Button
            color="grey"
            variant="outlined"
            size="small"
            class="text-none"
            @click="router.back()"
            ><v-icon icon="mdi-arrow-left" start /><span class="text-caption"
              >Voltar</span
            ></Button
          >
        </v-col>
      </template>
      <template #item.description="{ item }"
        ><span class="d-flex align-center"
          ><v-icon
            icon="mdi-receipt-text-outline"
            size="20"
            color="colorIcon"
            start
          /><span>{{ item.description || "Sem descrição" }}</span></span
        ></template
      >
      <template #item.emissionDate="{ item }"
        ><span>{{ formatDate(item.emissionDate) }}</span></template
      >
      <template #item.dueDate="{ item }"
        ><span>{{ formatDate(item.dueDate) }}</span></template
      >
      <template #item.value="{ item }"
        ><span>{{
          amountFormated(Number(item.value || 0), true)
        }}</span></template
      >
      <template #item.status="{ item }"
        ><v-chip
          size="small"
          :color="statusColor(item.status)"
          variant="flat"
          >{{ statusName(item.status) }}</v-chip
        ></template
      >
      <template #item.actions="{ item }">
        <v-btn
          icon
          color="colorIcon"
          variant="text"
          size="small"
          @click="openEdit(item)"
          ><v-icon icon="mdi-pencil-outline" size="20" /><v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
            >Editar</v-tooltip
          ></v-btn
        >
      </template>
    </Table>

    <DialogForm
      :show="showForm"
      title="Despesa"
      width="600"
      @dialog="closeForm"
      border-color="#c8e040"
    >
      <FormCrud :on-submit="handleSubmit">
        <v-row dense>
          <v-col cols="12" lg="6"
            ><DatePicker
              v-model="modelForm.emissionDate"
              label="Data de emissão"
              required
          /></v-col>
          <v-col cols="12" lg="6"
            ><DatePicker
              v-model="modelForm.dueDate"
              label="Data de vencimento"
              required
          /></v-col>
          <v-col cols="12"
            ><TextInput
              v-model="modelForm.description"
              label="Descrição"
              required
              icon="mdi-text-box-outline"
          /></v-col>
          <v-col cols="12" lg="6"
            ><CurrencyInput
              v-model="modelForm.value"
              label="Valor"
              required
              icon="mdi-currency-brl"
          /></v-col>
          <v-col cols="12" lg="6"
            ><SelectInput
              v-model="modelForm.status"
              label="Status"
              item-title="name"
              item-value="type"
              :items="statusItems"
          /></v-col>
        </v-row>
      </FormCrud>
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const financeStore = useFinanceStore();
const router = useRouter();
const { formatDate, amountFormated } = useUtils();
const loading = ref(false);
const search = ref("");
const showForm = ref(false);
const selected = ref<FinanceProps | undefined>(undefined);
const filters = ref<FinanceFiltersProps>({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  status: "",
  financeType: "expense",
});
const statusItems = [
  { name: "Aberto", type: "open" },
  { name: "Pago", type: "paid" },
  //{ name: "Cancelado", type: "canceled" },
];
const headers = [
  { title: "Descrição", key: "description" },
  { title: "Emissão", key: "emissionDate" },
  { title: "Vencimento", key: "dueDate" },
  { title: "Valor", key: "value" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions" },
];
const modelForm = ref({
  emissionDate: "",
  dueDate: "",
  description: "",
  value: "",
  status: "open",
});
const $all = computed(() => financeStore.$all);
const filteredItems = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return $all.value;
  return $all.value.filter((item) =>
    [item.description, item.status, item.publicId]
      .map((value) => String(value || "").toLowerCase())
      .some((value) => value.includes(query)),
  );
});
const handleSearch = (value: string) => {
  search.value = value;
};
const statusName = (status?: string) =>
  (status || "open").toLowerCase() === "paid"
    ? "Pago"
    : (status || "open").toLowerCase() === "canceled"
      ? "Cancelado"
      : "Aberto";
const statusColor = (status?: string) =>
  (status || "open").toLowerCase() === "paid"
    ? "green"
    : (status || "open").toLowerCase() === "canceled"
      ? "red"
      : "primary";
const resetForm = () => {
  modelForm.value = {
    emissionDate: dayjs().format("YYYY-MM-DD"),
    dueDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    description: "",
    value: "",
    status: "open",
  };
};
const openCreate = () => {
  selected.value = undefined;
  resetForm();
  showForm.value = true;
};
const openEdit = (item: FinanceProps) => {
  selected.value = item;
  modelForm.value = {
    emissionDate: item.emissionDate
      ? dayjs(item.emissionDate).format("YYYY-MM-DD")
      : "",
    dueDate: item.dueDate ? dayjs(item.dueDate).format("YYYY-MM-DD") : "",
    description: item.description || "",
    value: item.value ? String(item.value) : "",
    status: item.status || "open",
  };
  showForm.value = true;
};
const closeForm = () => {
  showForm.value = false;
  selected.value = undefined;
};
const handleFilter = async () => {
  loading.value = true;
  try {
    await financeStore.index(filters.value);
  } finally {
    loading.value = false;
  }
};
const handleClear = async () => {
  filters.value = {
    initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    status: "",
    financeType: "expense",
  };
  await handleFilter();
};
const handleSubmit = async () => {
  const payload: FinanceProps = {
    publicId: selected.value?.publicId,
    id: selected.value?.id,
    emissionDate: modelForm.value.emissionDate,
    dueDate: modelForm.value.dueDate,
    description: modelForm.value.description,
    value: Number(modelForm.value.value || 0),
    financeType: "expense",
    status: modelForm.value.status,
  };
  if (selected.value?.publicId) await financeStore.updated(payload);
  else await financeStore.store(payload);
  closeForm();
  resetForm();
  await handleFilter();
};
onMounted(async () => {
  resetForm();
  await handleFilter();
});
</script>
