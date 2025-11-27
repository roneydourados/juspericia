<template>
  <CardBlur height="100%">
    <v-row justify="center" align="center">
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
            {{
              amountFormated($estatisticsByAdmin?.totalSaltCredit ?? 0, true)
            }}
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
            {{
              amountFormated(
                $estatisticsByAdmin?.totalSaltCreditPending ?? 0,
                true
              )
            }}
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
            {{
              amountFormated(
                $estatisticsByAdmin?.totalSaltCreditExpired ?? 0,
                true
              )
            }}
          </div>
        </CardLeftBorderColor>
      </v-col>
    </v-row>
    <Table
      title="Créditos"
      :headers="headers"
      :items="$estatisticsByAdmin?.userCredit"
      :items-per-page="10"
      :showCrud="false"
    >
      <template v-slot:item.id="{ item }">
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-row dense>
                <v-col cols="12" lg="2">
                  <v-chip :color="getStatusName(item).color">
                    <v-icon
                      :color="getStatusName(item).color"
                      :icon="getStatusName(item).icon"
                      size="20"
                      start
                    />
                    {{ getStatusName(item).text }}
                  </v-chip>
                </v-col>
                <v-col
                  cols="12"
                  lg="4"
                  class="d-flex align-center"
                  style="gap: 1rem"
                >
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <span>Data crédito:</span>
                    <strong>{{ formatDate(item.creditDate) }}</strong>
                  </div>
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <span>Data expiração:</span>
                    <strong>{{ formatDate(item.expireDate) }}</strong>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                  class="d-flex align-center justify-end px-4"
                  style="gap: 1rem"
                >
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <span>Saldo:</span>
                    <strong>
                      {{ amountFormated(Number(item.salt ?? 0), true) }}
                    </strong>
                  </div>
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <span>Valor solicitação</span>
                    <strong>
                      {{
                        amountFormated(
                          Number(item.solicitationConsultationValue ?? 0),
                          true
                        )
                      }}
                    </strong>
                  </div>
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <v-btn
                      variant="text"
                      color="info"
                      icon
                      @click="getItemUpdateExpireAt(item)"
                      :disabled="
                        (dayjs(formatDate(item.expireDate)).isAfter(dayjs()) &&
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
                      :disabled="
                        item.status !== 'RECEIVED' &&
                        item.status !== 'CONFIRMED'
                      "
                    >
                      <v-icon icon="mdi-briefcase-arrow-left-right-outline" />
                      <v-tooltip
                        activator="parent"
                        location="top center"
                        content-class="tooltip-background"
                      >
                        Transferência de de saldo
                      </v-tooltip>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text
              v-for="log in item.UserCreditLog"
              :key="log.id"
            >
              <v-row dense>
                <v-col cols="12" lg="2">
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <span>Data</span>
                    <strong>{{
                      dayjs(log.createdAt).format("DD/MM/YYYY HH:mm")
                    }}</strong>
                  </div>
                </v-col>
                <v-col cols="12" lg="6">
                  <span>{{ log.history }}</span>
                </v-col>
                <v-col cols="12" lg="2">
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <span>Tipo: </span>
                    <strong>
                      {{ log.type === "C" ? "Crédito" : "Débito" }}
                    </strong>
                  </div>
                </v-col>
                <v-col cols="12" lg="2">
                  <div
                    class="d-flex align-center justify-end"
                    style="gap: 0.5rem"
                  >
                    <span>Valor: </span>
                    <strong>
                      {{ amountFormated(Number(log.value ?? 0), true) }}
                    </strong>
                  </div>
                </v-col>
              </v-row>
              <v-divider />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </Table>
    <AdminCreditSaltTransferSaltForm
      v-model="showFormSaltTransfer"
      :origin-transfer="selectedUserCreditSalt"
      @close="handleCloseFormTrasnfer"
    />
    <Dialog
      title="Atualizar Data de expiração crédito"
      :dialog="showUpdateExpireAt"
      @cancel="showUpdateExpireAt = false"
      @confirm="handleUpdateExpireAt"
      show-cancel
    >
      <DatePicker label="Nova data" v-model="newExpireAt" />
    </Dialog>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const emit = defineEmits(["refresh"]);
const userLawyer = useUserLawyerStore();
const saltCredit = useUserCreditSaltStore();
const auth = useAuthStore();
const { amountFormated, formatDate } = useUtils();

const selectedUserCreditSalt = ref<UserCreditSalt>();
const showFormSaltTransfer = ref(false);
const loading = ref(false);
const showUpdateExpireAt = ref(false);
const newExpireAt = ref("");

const headers = ref([
  {
    title: "",
    key: "id",
  },
]);

const $currentUser = computed(() => auth.$currentUser);
const $estatisticsByAdmin = computed(() => userLawyer.$estatisticsByAdmin);

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
    case "FINISHED":
      return {
        text: "Finalizado",
        color: "blue-grey-darken-2",
        icon: "mdi-check-circle-outline",
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
  showFormSaltTransfer.value = true;
};

const handleCloseFormTrasnfer = () => {
  selectedUserCreditSalt.value = undefined;
  emit("refresh");
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
  } finally {
    loading.value = false;
    showUpdateExpireAt.value = false;
    emit("refresh");
  }
};
</script>
