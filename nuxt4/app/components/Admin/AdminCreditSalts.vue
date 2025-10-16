<template>
  <div>
    <v-card flat rounded="lg" color="transparent">
      <v-card-title class="mb-4">
        <HeaderPage title="Saldo de créditos" font-size="1.8rem" />
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" lg="3">
            <CardLeftBorderColor
              title="Saldo Créditos"
              color="#c8e040"
              icon="mdi-calendar-month"
            >
              <div
                class="mt-4 text-primary"
                style="font-size: 1.88rem; font-weight: 600"
              >
                {{ amountFormated($salts?.totals?.total ?? 0, true) }}
              </div>
            </CardLeftBorderColor>
          </v-col>
          <v-col cols="12" lg="3">
            <CardLeftBorderColor
              title="Total Pendente"
              color="#0F91C3"
              icon="mdi-calendar-month"
            >
              <div
                class="mt-4 text-primary"
                style="font-size: 1.88rem; font-weight: 600"
              >
                {{ amountFormated($salts?.totals?.totalPending ?? 0, true) }}
              </div>
            </CardLeftBorderColor>
          </v-col>
          <v-col cols="12" lg="3">
            <CardLeftBorderColor
              title="Total expirado"
              color="#F6BF0C"
              icon="mdi-calendar-month"
            >
              <div
                class="mt-4 text-primary"
                style="font-size: 1.88rem; font-weight: 600"
              >
                {{ amountFormated($salts?.totals?.totalExpired ?? 0, true) }}
              </div>
            </CardLeftBorderColor>
          </v-col>
        </v-row>
        <v-row dense class="py-4">
          <v-col cols="12" lg="10">
            <AdminCreditSaltsFilters v-model="filters" />
          </v-col>
          <v-col cols="12" lg="2">
            <Button
              variant="flat"
              color="primary"
              class="text-none mt-4"
              @click="handleFilter"
            >
              <v-icon icon="mdi-filter-outline" color="colorIcon" start />
              <span class="text-caption"> Filtrar </span>
            </Button>
          </v-col>
        </v-row>
        <div class="py-4">
          <Table
            title="Compras"
            font-size="1.5rem"
            :headers="headers"
            :items="$salts?.credits"
            :show-crud="false"
          >
            <template #item.status="{ item }">
              <v-chip :color="getStatusName(item).color">
                <v-icon
                  :color="getStatusName(item).color"
                  :icon="getStatusName(item).icon"
                  size="20"
                  start
                />
                {{ getStatusName(item).text }}
              </v-chip>
            </template>
            <template #item.dateCreated="{ item }">
              <strong>
                {{ dayjs(item.dateCreated).format("DD/MM/YYYY") }}
              </strong>
            </template>
            <template #item.value="{ item }">
              <strong>{{ amountFormated(item.value, true) }}</strong>
            </template>
            <template #item.salt="{ item }">
              <strong>{{ amountFormated(item.salt, true) }}</strong>
            </template>
            <template #item.solicitationConsultationValue="{ item }">
              <strong>{{
                amountFormated(item.solicitationConsultationValue, true)
              }}</strong>
            </template>

            <template #item.expireDate="{ item }">
              <strong>
                {{ dayjs(item.expireDate).format("DD/MM/YYYY") }}
              </strong>
            </template>
            <template #item.createdAt="{ item }">
              <strong>{{ dayjs(item.createdAt).format("DD/MM/YYYY") }}</strong>
            </template>
            <template #item.actions="{ item }">
              <v-btn
                variant="text"
                color="info"
                icon
                @click="getItemUpdateExpireAt(item)"
                :disabled="
                  (dayjs(item.expireDate).isAfter(dayjs()) &&
                    $currentUser?.profile?.type !== 'ADMIN') ||
                  Number(item.salt ?? 0) <= 0
                "
              >
                <v-icon icon="mdi-calendar-month"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Ajustar data de expiração
                </v-tooltip>
              </v-btn>
              <v-btn
                variant="text"
                color="info"
                icon
                @click="handleShowFormSaltTransfer(item)"
                :disabled="!filters.lawyer"
              >
                <v-icon icon="mdi-briefcase-arrow-left-right-outline"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Transferência de de saldo
                </v-tooltip>
              </v-btn>
            </template>
          </Table>
        </div>
      </v-card-text>
    </v-card>
    <AdminCreditSaltTransferSaltForm
      v-model="showFormSaltTransfer"
      :origin-transfer="selectedUserCreditSalt"
      @close="handleCloseFormTrasnfer"
    />
    <v-snackbar
      v-model="showErrorAlert"
      vertical
      color="warning"
      :timeout="10000"
    >
      <div class="text-subtitle-1 pb-2">Saldo de crédito estava expirado</div>
      <div class="text-subtitle-1 pb-2">
        Não foi possível gerar cobrança deste saldo, pois o mesmo estava
        expirado. Acesse a sessão de pacotes efetue uma nova compra ou entre em
        contato com nossa equipe de vendas. Não se preocupe, não será gerada
        nenhuma cobrança adicional para você. ESTE SALDO DE CRÉDITO FOI REMOVIDO
        DA SUA CONTA.
      </div>
      <template #actions>
        <v-btn color="white" variant="text" @click="showErrorAlert = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
    <DialogLoading :dialog="loading" />
    <Dialog
      title="Atualizar Data de expiração crédito"
      :dialog="showUpdateExpireAt"
      @cancel="showUpdateExpireAt = false"
      @confirm="handleUpdateExpireAt"
      show-cancel
    >
      <DatePicker label="Nova data" v-model="newExpireAt" />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const saltCredit = useUserCreditSaltStore();
const auth = useAuthStore();

const { amountFormated } = useUtils();
const showFormSaltTransfer = ref(false);
const loading = ref(false);
const showErrorAlert = ref(false);
const showUpdateExpireAt = ref(false);
const selectedUserCreditSalt = ref<UserCreditSalt>();
const newExpireAt = ref("");
const filters = ref({
  initialDate: "",
  finalDate: "",
  status: "CONFIRMED",
  lawyer: undefined as UserProps | undefined,
  isSalt: true,
  publicIdExclude: undefined as string | undefined,
});

const headers = ref([
  {
    title: "Status",
    align: "start",
    sortable: false,
    key: "status",
  },
  { title: "Data da compra", key: "dateCreated" },
  { title: "Data de expiração", key: "expireDate" },
  { title: "Valor", key: "value" },
  { title: "Saldo", key: "salt" },
  {
    title: "Cliente",
    key: "user.name",
  },
  { title: "Ações", key: "actions" },
]);

const $salts = computed(() => saltCredit.$credits);
const $currentUser = computed(() => auth.$currentUser);

const getStatusName = (item: UserCreditSalt) => {
  const currentDate = dayjs();

  switch (item.status) {
    case "CONFIRMED":
    case "RECEIVED":
      // se estiver ativo, então verificar se não expirou
      return {
        text: dayjs(item.expireDate).isBefore(currentDate)
          ? "Expirado"
          : "Disponível",
        color: dayjs(item.expireDate).isBefore(currentDate)
          ? "warning"
          : "success",
        icon: "mdi-check-circle-outline",
      };
    case "PENDING":
      return {
        text: "Pendente",
        color: "warning",
        icon: "mdi-circle-outline",
      };
    case "REFUNDED":
      return {
        text: "Cancelado",
        color: "error",
        icon: "mdi-cancel",
      };
    default:
      return {
        text: "Indefinido",
        color: "grey",
        icon: "mdi-circle-outline",
      };
  }
};

const handleShowFormSaltTransfer = (item: UserCreditSalt) => {
  selectedUserCreditSalt.value = item;
  //await handleFilter();
  showFormSaltTransfer.value = true;
};

const handleFilter = async () => {
  loading.value = true;
  try {
    await saltCredit.indexAdmin({
      initialDate: filters.value.initialDate,
      finalDate: filters.value.finalDate,
      status: filters.value.status,
      userId: filters.value.lawyer?.id,
      isSalt: filters.value.isSalt,
    });
  } finally {
    loading.value = false;
  }
};

const handleCloseFormTrasnfer = async () => {
  selectedUserCreditSalt.value = undefined;
  await handleFilter();
};

const getItemUpdateExpireAt = (item: UserCreditSalt) => {
  selectedUserCreditSalt.value = item;
  showUpdateExpireAt.value = true;
};

const handleUpdateExpireAt = async () => {
  if (!selectedUserCreditSalt.value) return;

  loading.value = true;
  try {
    await saltCredit.updateExpireAt({
      publicId: selectedUserCreditSalt.value.publicId!,
      newExpireAt: newExpireAt.value,
    });

    await handleFilter();
  } finally {
    loading.value = false;
    showUpdateExpireAt.value = false;
  }
};
</script>
