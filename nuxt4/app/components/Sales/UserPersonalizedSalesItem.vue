<template>
  <v-expansion-panels variant="accordion">
    <v-expansion-panel rounded="lg" :elevation="1">
      <v-expansion-panel-title>
        <v-row dense align="center" no-gutters class="pe-2">
          <v-col cols="12" sm="2" class="mb-1 mb-sm-0">
            <v-chip
              :prepend-icon="statusDetails.icon"
              variant="tonal"
              :color="statusDetails.color"
              size="small"
            >
              <span class="text-caption font-weight-medium">{{
                statusDetails.label
              }}</span>
            </v-chip>
          </v-col>
          <v-col cols="12" sm="5" class="mb-1 mb-sm-0">
            <span class="text-body-2 font-weight-medium">{{
              item.description
            }}</span>
          </v-col>
          <v-col cols="6" sm="3" class="text-sm-center">
            <span class="text-body-2 font-weight-bold">
              {{ amountFormated(Number(item.value ?? 0), true) }}
            </span>
          </v-col>
          <v-col cols="6" sm="2" class="text-right">
            <span class="text-caption text-medium-emphasis">
              {{ formatDate(item.dateCreated) }}
            </span>
          </v-col>
        </v-row>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row dense class="mb-3">
          <v-col cols="6" sm="3">
            <div class="text-caption text-medium-emphasis">Valida até</div>
            <div class="text-body-2 font-weight-medium">
              {{ formatDate(item.dueDate) }}
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="text-caption text-medium-emphasis">
              Forma de Pagamento
            </div>
            <div class="text-body-2 font-weight-medium">{{ paymentLabel }}</div>
          </v-col>
          <v-col cols="6" sm="2">
            <div class="text-caption text-medium-emphasis">Qtde Consultas</div>
            <div class="text-body-2 font-weight-medium">
              {{ item.packgeQuantity ?? "—" }}
            </div>
          </v-col>
          <v-col cols="6" sm="2">
            <div class="text-caption text-medium-emphasis">
              Valor / Consulta
            </div>
            <div class="text-body-2 font-weight-medium">{{ unitValue }}</div>
          </v-col>
        </v-row>

        <v-divider class="mb-3" />

        <div class="d-flex flex-wrap" style="gap: 0.5rem">
          <Button
            v-if="item.status === 'PENDING'"
            color="success"
            variant="tonal"
            size="small"
            @click="emit('pre-checkout', item)"
          >
            <v-icon icon="mdi-cash-multiple" start />
            Efetuar pagamento
          </Button>
          <Button
            v-if="item.status === 'PENDING' && item.publicId"
            color="error"
            variant="tonal"
            size="small"
            @click="emit('cancel-transaction', item.publicId)"
          >
            <v-icon icon="mdi-cancel" start />
            Cancelar
          </Button>
          <Button
            v-if="item.transactionReceiptUrl"
            color="info"
            variant="tonal"
            size="small"
            @click="emit('view-receipt', item)"
          >
            <v-icon icon="mdi-receipt-text-outline" start />
            Comprovante
          </Button>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const { amountFormated, formatDate } = useUtils();

const props = defineProps<{ item: SaleProps }>();
const emit = defineEmits<{
  (e: "cancel-transaction", publicId: string): void;
  (e: "pre-checkout", item: SaleProps): void;
  (e: "view-receipt", item: SaleProps): void;
}>();

const statusDetails = computed(() => {
  const dueDate = props.item.dueDate?.substring(0, 10);
  const isOverdue =
    dayjs().isAfter(dayjs(dueDate)) &&
    !!props.item.saleId &&
    props.item.status === "PENDING";

  if (isOverdue)
    return {
      label: "Vencida",
      color: "orange-darken-2",
      icon: "mdi-clock-alert-outline",
    };

  const map: Record<string, { label: string; color: string; icon: string }> = {
    CONFIRMED: {
      label: "Confirmado",
      color: "success",
      icon: "mdi-check-circle",
    },
    PENDING: { label: "Pendente", color: "warning", icon: "mdi-clock-outline" },
    CANCELED: { label: "Cancelado", color: "error", icon: "mdi-close-circle" },
    REFUNDED: { label: "Reembolsado", color: "blue-grey", icon: "mdi-undo" },
  };
  return (
    map[props.item.status ?? ""] ?? {
      label: "Desconhecido",
      color: "grey",
      icon: "mdi-help-circle",
    }
  );
});

const paymentLabel = computed(() => {
  const map: Record<string, string> = {
    CREDIT_CARD: "Cartão de Crédito",
    BOLETO: "Boleto",
    PIX: "Pix",
  };
  return map[props.item.billingType ?? ""] ?? "Nenhum";
});

const unitValue = computed(() => {
  const total = Number(props.item.packgeSaleValue ?? 0);
  const qty = props.item.packgeQuantity ?? 1;
  return amountFormated(total / qty, true);
});
</script>
