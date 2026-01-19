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
                class="mt-4 text-colorTextPrimary"
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
                class="mt-4 text-colorTextPrimary"
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
                class="mt-4 text-colorTextPrimary"
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
          <v-col v-if="$currentUser?.isMaster" cols="12" lg="2">
            <Button
              variant="flat"
              color="primary"
              class="text-none mt-4"
              @click="showAdminCreditSalt = true"
            >
              <v-icon icon="mdi-plus" color="colorIcon" start />
              <span class="text-caption"> Lançar avulso </span>
            </Button>
          </v-col>
        </v-row>
        <div class="py-4">
          <Table
            title="Clientes"
            :headers="headers"
            :items="$lawyers?.lawyers"
            :show-crud="false"
          >
            <template v-slot:item.phone="{ item }">
              <span
                class="d-flex align-center"
                v-ripple
                @click="handleWhatsapp(item.phone)"
                style="cursor: pointer"
              >
                <v-icon icon="mdi-whatsapp" size="24" color="colorIcon" start />
                <span>
                  {{
                    item.phone
                      ? formatTelephoneNumber(item.phone)
                      : "Não informado"
                  }}
                </span>
              </span>
            </template>
            <template v-slot:item.whatsapp="{ item }">
              <span
                class="d-flex align-center"
                v-ripple
                @click="handleWhatsapp(item.whatsapp)"
                style="cursor: pointer"
              >
                <v-icon icon="mdi-whatsapp" size="24" color="colorIcon" start />
                <span>
                  {{
                    item.phone
                      ? formatTelephoneNumber(item.whatsapp)
                      : "Não informado"
                  }}
                </span>
              </span>
            </template>
            <template v-slot:item.salt="{ item }">
              <strong>{{ amountFormated(item.salt, true) }}</strong>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                variant="text"
                color="info"
                icon
                @click="handleShowDetails(item)"
              >
                <v-icon icon="mdi-account-details-outline"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Detalhes
                </v-tooltip>
              </v-btn>
            </template>
          </Table>
        </div>
      </v-card-text>
    </v-card>
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
    <AdminCreditSaltsDetails
      v-model="showDetails"
      :item="selectedLawyer"
      @close="handleFilter"
    />
    <AdminCreditSaltsForm v-model="showAdminCreditSalt" @close="handleFilter" />
  </div>
</template>

<script setup lang="ts">
//import dayjs from "dayjs";
import { useDisplay } from "vuetify";

const saltCredit = useUserCreditSaltStore();
const auth = useAuthStore();

const { amountFormated, whatsappUrl, formatTelephoneNumber } = useUtils();
const { mobile } = useDisplay();

const loading = ref(false);
const showErrorAlert = ref(false);
const showDetails = ref(false);
const showAdminCreditSalt = ref(false);
const selectedLawyer = ref<LawyerEstatisticsByAdmin>();

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
    title: "Id",
    key: "id",
  },
  {
    title: "Nome",
    key: "name",
  },
  {
    title: "Telefone",
    key: "phone",
  },
  {
    title: "Whatsapp",
    key: "whatsapp",
  },
  {
    title: "Saldo",
    key: "salt",
  },
  { title: "Ações", key: "actions" },
]);

const $salts = computed(() => saltCredit.$credits);
const $lawyers = computed(() => saltCredit.$lawyers);
const $currentUser = computed(() => auth.$currentUser);

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
    await saltCredit.getLawyers(filters.value.lawyer?.id);
  } finally {
    loading.value = false;
  }
};

const handleWhatsapp = (phone: string) => {
  if (!phone) return;

  const url = whatsappUrl(
    phone,
    "Olá, aqui quem fala é seu gestor comercial da jusperícia. Podemos conversar ?",
    mobile.value,
  );
  window.open(url, "_blank");
};

const handleShowDetails = (item: LawyerEstatisticsByAdmin) => {
  selectedLawyer.value = item;
  showDetails.value = true;
};
</script>
