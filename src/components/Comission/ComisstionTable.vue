<template>
  <Table
    title="Controle de comissões"
    :items="$all"
    :headers="headers"
    @add="showForm = true"
    :loading="loading"
    :show-crud="false"
    show-select
    v-model="comissionsSelecteds"
  >
    <template #top-table>
      <v-row dense class="mt-4">
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
        <v-col cols="12" lg="2">
          <SelectInput
            label="Status"
            v-model="filters.status"
            :items="[
              { title: 'Todos', value: 'all' },
              { title: 'Pendente', value: 'pending' },
              { title: 'Paga', value: 'paid' },
              { title: 'Canceladas', value: 'cancel' },
            ]"
            item-title="title"
            item-value="value"
            @update:model-value="handleGetComissions"
          />
        </v-col>
        <v-col cols="12" lg="2">
          <SelectInput
            label="Tipo de comissão"
            v-model="filters.comissionType"
            :items="[
              { title: 'Vendedor', value: 'seller' },
              { title: 'Médico', value: 'medic' },
            ]"
            item-title="title"
            item-value="value"
            @update:model-value="handleModelValueComissionType"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <SelectSearchSeller
            v-if="filters.comissionType === 'seller'"
            v-model="filters.user"
          />
          <SelectSearchMedic
            v-else-if="filters.comissionType === 'medic'"
            v-model="filters.user"
          />
        </v-col>
      </v-row>
      <v-row dense class="py-4">
        <v-col cols="12" lg="2">
          <v-card rounded="lg">
            <v-card-text>
              <div class="d-flex flex-column align-center" style="gap: 0.5rem">
                <h3>Total:</h3>
                <v-chip label color="blue" class="text-none" variant="flat">
                  <div style="font-size: 1rem">
                    {{ $total }}
                  </div>
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="2">
          <v-card rounded="lg">
            <v-card-text>
              <div class="d-flex flex-column align-center" style="gap: 0.5rem">
                <h3>Total selecionado:</h3>
                <v-chip label color="blue" class="text-none" variant="flat">
                  <div style="font-size: 1rem">
                    {{ $totalSelected }}
                  </div>
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          lg="8"
          class="d-flex flex-wrap align-center justify-end mb-4"
          style="gap: 0.5rem"
        >
          <v-btn
            color="blue"
            variant="flat"
            size="small"
            class="text-none"
            @click="router.back()"
          >
            <v-icon icon="mdi-arrow-left" start />
            Voltar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            class="text-none"
            @click="handleGetComissions"
          >
            <v-icon icon="mdi-filter-outline" start />
            Filtrar comissões
          </v-btn>
          <v-btn
            color="green"
            variant="flat"
            size="small"
            class="text-none"
            :disabled="
              !filters.user ||
              comissionsSelecteds.length === 0 ||
              filters.status !== 'pending'
            "
            @click="showPaidComissionDialog = true"
          >
            <v-icon icon="mdi-check-all" start />
            Pagar selecionadas
          </v-btn>
          <v-btn
            color="red"
            variant="flat"
            size="small"
            class="text-none"
            :disabled="!filters.user || comissionsSelecteds.length === 0"
            @click="showCancelComissionDialog = true"
          >
            <v-icon icon="mdi-cancel" start />
            Cancelar selecionadas
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <template v-slot:item.user="{ item }">
      <span>{{ item.user.name }}</span>
    </template>
    <template v-slot:item.comissionDate="{ item }">
      <span>{{ formatDate(item.comissionDate) }}</span>
    </template>
    <template v-slot:item.comissionDatePaid="{ item }">
      <span>{{ formatDate(item.comissionDatePaid) }}</span>
    </template>
    <template v-slot:item.comissionPercentage="{ item }">
      <span>
        {{
          Number(item.comissionPercentage ?? 0) > 0
            ? `${amountFormated(
                Number(item.comissionPercentage ?? "0"),
                false
              )}%`
            : "Comissão fixa"
        }}
      </span>
    </template>
    <template v-slot:item.comissionValue="{ item }">
      <strong>
        {{ amountFormated(Number(item.comissionValue ?? "0"), true) }}
      </strong>
    </template>
    <template v-slot:item.comissionBase="{ item }">
      <span>
        {{ amountFormated(Number(item.comissionBase ?? "0"), true) }}
      </span>
    </template>
    <template v-slot:item.comissionType="{ item }">
      <span>
        {{ getComissionType(item.comissionType) }}
      </span>
    </template>
    <template v-slot:item.comissionStatus="{ item }">
      <v-chip
        density="compact"
        :color="item.comissionStatus === 'paid' ? 'green' : 'orange'"
        :prepend-icon="
          item.comissionStatus === 'paid'
            ? 'mdi-check-all'
            : 'mdi-clock-outline'
        "
        class="text-none"
      >
        <strong>
          {{ getComisstionStatus(item.comissionStatus) }}
        </strong>
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        color="blue"
        variant="text"
        size="small"
        @click="getComissionDetails(item)"
      >
        <v-icon icon="mdi-dots-vertical-circle-outline" size="20"></v-icon>
        <v-tooltip
          activator="parent"
          location="top center"
          content-class="tooltip-background"
        >
          Detalhar comissão
        </v-tooltip>
      </v-btn>
    </template>
  </Table>
  <Dialog
    title="Pagar comissão"
    :dialog="showPaidComissionDialog"
    @cancel="showPaidComissionDialog = false"
    @confirm="handlePaidComissions"
    :show-cancel="true"
  >
    <strong>Confirma o pagamento de todas as comssões selecionadas ?</strong>
  </Dialog>

  <Dialog
    title="Cancelar comissão"
    :dialog="showCancelComissionDialog"
    @cancel="showCancelComissionDialog = false"
    :show-cancel="true"
    @confirm="handleCancelComissions"
  >
    <strong>Confirma o cancelamento de todas as comssões selecionadas ?</strong>
  </Dialog>
  <DialogLoading :dialog="loading" />
  <ComissionDetails v-model="showComissionDetails" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import SelectSearchMedic from "../SelectsSearch/SelectSearchMedic.vue";

const comission = useComissionStore();
const router = useRouter();
const { formatDate, amountFormated } = useUtils();

const $all = computed(() => comission.$all);
const $total = computed(() => {
  const total = comission.$all.reduce((acc, item) => {
    return acc + (Number(item.comissionValue) || 0);
  }, 0);
  return amountFormated(total, false);
});
const $totalSelected = computed(() => {
  const total = comissionsSelecteds.value.reduce((acc, item) => {
    return acc + (Number(item.comissionValue) || 0);
  }, 0);
  return amountFormated(total, false);
});
const showForm = ref(false);
const loading = ref(false);

const showPaidComissionDialog = ref(false);
const showCancelComissionDialog = ref(false);
const showComissionDetails = ref(false);
const comissionsSelecteds = ref([] as ComissionProps[]);

const filters = ref({
  comissionType: "seller",
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  status: "all",
  user: undefined as UserProps | undefined,
});

const headers = ref([
  { title: "Beneficiado", key: "user" },
  { title: "Data comissão", key: "comissionDate" },
  { title: "%Comissão", key: "comissionPercentage" },
  { title: "Base comissão", key: "comissionBase" },
  { title: "Valor comissão", key: "comissionValue" },
  { title: "Status", key: "comissionStatus" },
  { title: "Data pagamento", key: "comissionDatePaid" },
  { title: "Tipo", key: "comissionType" },
  { title: "Ações", key: "actions" },
]);

onUnmounted(() => {
  comission.clear();
});

const getComissionType = (type: string) => {
  switch (type) {
    case "seller":
      return "Vendedor";
    case "medic":
      return "Médico";
    default:
      return "Desconhecido";
  }
};

const getComisstionStatus = (status: string) => {
  switch (status) {
    case "paid":
      return "Pago";
    case "pending":
      return "Pendente";
    case "cancel":
      return "Cancelado";
    default:
      return "Desconhecido";
  }
};

const handleModelValueComissionType = async () => {
  filters.value.user = undefined;
  await handleGetComissions();
};

const handleGetComissions = async () => {
  loading.value = true;
  try {
    await comission.index({
      initialDate: filters.value.initialDate,
      finalDate: filters.value.finalDate,
      status: filters.value.status !== "all" ? filters.value.status : undefined,
      comissionType: filters.value.comissionType,
      userId: filters.value.user?.id,
    });
    comissionsSelecteds.value = [];
  } catch (error) {
    console.error("Error fetching comissions:", error);
  } finally {
    loading.value = false;
  }
};

const handlePaidComissions = async () => {
  if (comissionsSelecteds.value.length === 0) return;

  loading.value = true;
  try {
    for (const comissionItem of comissionsSelecteds.value) {
      if (!comissionItem.publicId) continue;
      await comission.paidComission(comissionItem.publicId);
    }

    comissionsSelecteds.value = [];
    await handleGetComissions();
  } catch (error) {
    console.error("Error paying comissions:", error);
  } finally {
    showPaidComissionDialog.value = false;
    loading.value = false;
  }
};

const handleCancelComissions = async () => {
  if (comissionsSelecteds.value.length === 0) return;

  loading.value = true;
  try {
    for (const comissionItem of comissionsSelecteds.value) {
      await comission.cancelComission(comissionItem.publicId!);
    }
    comissionsSelecteds.value = [];

    await handleGetComissions();
  } catch (error) {
    console.error("Error paying comissions:", error);
  } finally {
    showCancelComissionDialog.value = false;
    loading.value = false;
  }
};

const getComissionDetails = async (item: ComissionProps) => {
  if (!item.publicId) return;

  loading.value = true;
  try {
    await comission.show(item.publicId);
    showComissionDetails.value = true;
  } finally {
    loading.value = false;
  }
};
</script>
