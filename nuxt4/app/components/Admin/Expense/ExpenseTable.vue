<template>
  <div>
    <Table
      title="Despesas"
      font-size="1.5rem"
      :items="$all"
      :headers="headers"
      :loading="loading"
      :show-crud="false"
      show-select
      v-model="selectedDown"
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
            @update:modelValue="handleFilter"
            clearable
        /></v-col>
        <v-col
          cols="12"
          lg="6"
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
            color="green"
            variant="flat"
            size="small"
            class="text-none"
            @click="openCreate"
            ><v-icon icon="mdi-plus" start /><span class="text-caption"
              >Adicionar</span
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
            ><v-icon icon="mdi-arrow-left" start />
            <span class="text-caption"> Voltar </span>
          </Button>

          <Button
            color="warning"
            variant="flat"
            size="small"
            class="text-none"
            @click="handleDownMany"
            ><v-icon icon="mdi-arrow-down" start />
            <span class="text-caption"> Dar Baixa </span>
          </Button>
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

    <ExpenseForm
      v-model:show="showForm"
      v-model:data="modelForm"
      @submit="handleSubmit"
      @close="closeForm"
    />
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const financeStore = useFinanceStore();
const router = useRouter();
const { formatDate, amountFormated } = useUtils();
const loading = ref(false);
const showForm = ref(false);
const selected = ref<FinanceProps | undefined>(undefined);
const selectedDown = ref<FinanceProps[]>([]);
const filters = ref<FinanceFiltersProps>({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  status: "open",
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
    valueOpen: Number(modelForm.value.value || 0),
    financeType: "expense",
    status: modelForm.value.status,
  };
  if (selected.value?.publicId) await financeStore.updated(payload);
  else await financeStore.store(payload);
  closeForm();
  resetForm();
  await handleFilter();
};

const handleDownMany = () => {
  if (selectedDown.value.length === 0) {
    push.warning("Selecione ao menos uma despesa para dar baixa.");
    return;
  }

  push.info({
    title: "Dar baixa em despesas",
    message: "Tem certeza que deseja dar baixa nas despesas selecionadas?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Baixar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              const ids = selectedDown.value.map(
                (expense) => expense.publicId!,
              );

              await financeStore.downMany(ids);

              push.success("Despesas baixadas com sucesso.");
            } catch (error) {
              push.error("Erro ao dar baixa nas despesas.");
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Cancelar",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};

onMounted(async () => {
  resetForm();
  await handleFilter();
});
</script>
