<template>
  <DialogForm
    :show="show"
    title="Recibo de pagamento por saldo de créditos"
    @dialog="show = false"
    width="800"
  >
    <v-card>
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col
            cols="12"
            lg="2"
            class="d-flex align-center"
            style="gap: 0.5rem"
          >
            <span>
              Solicitação:
              <strong>{{ solicitation.id }}</strong>
            </span>
          </v-col>
          <v-col
            cols="12"
            lg="10"
            class="d-flex align-center"
            style="gap: 0.5rem"
          >
            <span>
              Paciente:
              <strong>
                {{ solicitation.Patient?.name }}
                {{ solicitation.Patient?.surname }}
              </strong>
            </span>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col
            cols="12"
            lg="2"
            class="d-flex align-center"
            style="gap: 0.5rem"
          >
            <span>
              Total:
              <strong>
                {{
                  Number(solicitation.valueCredit ?? 0) +
                  Number(solicitation.antecipationValue ?? 0)
                }}
              </strong>
            </span>
          </v-col>
          <v-col
            cols="12"
            lg="10"
            class="d-flex align-center"
            style="gap: 0.5rem"
          >
            <span>
              Paciente:
              <strong>
                {{ solicitation.Patient?.name }}
                {{ solicitation.Patient?.surname }}
              </strong>
            </span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </DialogForm>
</template>

<script setup lang="ts">
defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => {},
  },
});

const show = defineModel({
  default: false,
});
</script>
