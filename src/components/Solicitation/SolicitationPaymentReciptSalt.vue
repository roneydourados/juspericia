<template>
  <DialogForm
    :show="show"
    title="Recibo de pagamento por saldo de créditos"
    @dialog="show = false"
    width="800"
  >
    <v-card variant="outlined">
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col
            cols="12"
            lg="4"
            class="d-flex align-center justify-end"
            style="gap: 0.5rem"
          >
            <span> Solicitação: </span>
          </v-col>
          <v-col
            cols="12"
            lg="8"
            class="d-flex align-center"
            style="gap: 0.5rem"
          >
            <strong>{{ solicitation.id }}</strong>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            lg="4"
            class="d-flex align-center justify-end"
            style="gap: 0.5rem"
          >
            <span> Paciente: </span>
          </v-col>
          <v-col cols="12" lg="8" style="gap: 0.5rem">
            <strong>
              {{ solicitation.Patient?.name }}
              {{ solicitation.Patient?.surname }}
            </strong>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col
            cols="12"
            lg="4"
            class="d-flex align-center justify-end"
            style="gap: 0.5rem"
          >
            <span> Total: </span>
          </v-col>
          <v-col cols="12" lg="8" style="gap: 0.5rem">
            <strong>
              {{
                amountFormated(
                  Number(solicitation.consultationValue ?? 0) +
                    Number(solicitation.antecipationValue ?? 0),
                  true
                )
              }}
            </strong>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col
            cols="12"
            lg="4"
            class="d-flex align-center justify-end"
            style="gap: 0.5rem"
          >
            <span> Data da solicitação: </span>
          </v-col>
          <v-col cols="12" lg="8" style="gap: 0.5rem">
            <strong>
              {{ dayjs(solicitation.dateOpen).format("DD/MM/YYYY") }}
            </strong>
          </v-col>
        </v-row>

        <v-divider class="mt-6" />
        <v-row>
          <v-col cols="12" class="pa-12">
            <p class="text-grey text-center">
              Comprovante de uso de saldo de créditos para pagamento de
              solicitação de consulta.
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => {},
  },
});

const { amountFormated } = useUtils();

const show = defineModel({
  default: false,
});
</script>
