<template>
  <div>
    <div
      class="font-weight-bold text-primary mb-4 mt-4"
      :style="`${mobile ? 'font-size: 0.8rem' : 'font-size: 1.2rem'}`"
    >
      Dados do escritório
    </div>
    <v-row dense class="text-primary">
      <v-col cols="12">
        <InfoLabel
          title="Email"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.Patient?.User?.email ?? 'Não informado'"
        />
      </v-col>
      <v-col cols="12" lg="8">
        <InfoLabel
          title="Nome do advogado"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.Patient?.User?.name ?? 'Não informado'"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          title="OAB"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.Patient?.User?.oab ?? 'NNNNN'"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          title="OAB/UF"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.Patient?.User?.oabUf ?? 'NN'"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <InfoLabel
          title="CNPJ"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="
            $single?.Patient?.User?.cpfCnpj
              ? formatCPFOrCNPJ($single?.Patient?.User?.cpfCnpj ?? '')
              : 'Não informado'
          "
        />
      </v-col>
      <v-col cols="12" lg="6">
        <InfoLabel
          title="Telefone"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="
            $single?.Patient?.User?.phone
              ? formatTelephoneNumber($single?.Patient?.User?.phone ?? '')
              : 'Não informado'
          "
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { formatTelephoneNumber, formatCPFOrCNPJ } = useUtils();
const storeConsultation = useSolicitationConsultationStore();

const $single = computed(() => storeConsultation.$single);
</script>
