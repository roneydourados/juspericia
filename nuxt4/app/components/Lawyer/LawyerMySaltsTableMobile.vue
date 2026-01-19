<template>
  <div class="d-flex justify-end align-center mb-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      :color="`${$currentTheme === 'mainThemeDark' ? '' : 'primary'}`"
      rounded="circle"
      density="comfortable"
      :total-visible="PAGINATION_TOTAL_VISIBLE"
    />
    <span class="text-caption text-colorTextPrimary">
      Pg. {{ page }} de {{ pageCount }}
    </span>
  </div>
  <CardBlur
    v-for="item in paginatedItems"
    :key="item.id"
    class="mb-2 text-colorTextPrimary"
    :hover="false"
    style="border-top: 3px solid #c8e040"
  >
    <template #content>
      <div class="d-flex flex-column">
        <div
          class="d-flex justify-space-between align-center"
          style="gap: 0.5rem"
        >
          <strong>Status</strong>
          <v-chip :color="getStatusName(item).color">
            <v-icon
              :color="getStatusName(item).color"
              :icon="getStatusName(item).icon"
              size="20"
              start
            />
            {{ getStatusName(item).text }}
          </v-chip>
        </div>
        <div
          class="d-flex justify-space-between align-center mt-2"
          style="gap: 0.5rem"
        >
          <span>Data da compra</span>
          <strong>
            {{ dayjs(item.creditDate).format("DD/MM/YYYY") }}
          </strong>
        </div>
        <div
          class="d-flex justify-space-between align-center mt-2"
          style="gap: 0.5rem"
        >
          <span>Valor:</span>
          <strong>{{ amountFormated(Number(item.value ?? 0), true) }}</strong>
        </div>
        <div
          class="d-flex justify-space-between align-center mt-2"
          style="gap: 0.5rem"
        >
          <span>Saldo:</span>
          <strong>{{ amountFormated(Number(item.salt ?? 0), true) }}</strong>
        </div>
        <div
          class="d-flex justify-space-between align-center mt-2"
          style="gap: 0.5rem"
        >
          <span>Vlr Solicitação:</span>
          <strong>{{
            amountFormated(
              Number(item.solicitationConsultationValue ?? 0),
              true,
            )
          }}</strong>
        </div>
      </div>
    </template>
    <template #actions>
      <div class="d-flex align-center justify-end w-100" style="gap: 0.5rem">
        <v-btn
          variant="text"
          color="info"
          icon
          size="small"
          @click="emit('details', item)"
        >
          <v-icon icon="mdi-dots-vertical"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Detalhes
          </v-tooltip>
        </v-btn>
        <v-btn
          v-if="item.status === 'PENDING'"
          variant="text"
          color="success"
          icon
          size="small"
          @click="emit('paid', item)"
        >
          <v-icon icon="mdi-cash-multiple"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Efetuar pagamento
          </v-tooltip>
        </v-btn>
        <v-btn
          v-if="item.status === 'CONFIRMED'"
          variant="text"
          color="info"
          icon
          size="small"
          @click="emit('receipt', item)"
        >
          <v-icon icon="mdi-file-multiple"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Comprovante de pagamento
          </v-tooltip>
        </v-btn>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const emit = defineEmits(["edit", "delete", "receipt", "paid", "details"]);
const saltCredit = useUserCreditSaltStore();
const { amountFormated } = useUtils();
const $all = computed(() => saltCredit.$credits?.credits);
const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

const itemsPerPage = ref(10);
const page = ref(1);

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

const getStatusName = (item: UserCreditSalt) => {
  const currentDate = dayjs();

  switch (item.status) {
    case "CONFIRMED":
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
</script>
