<template>
  <div>
    <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
      Dados do escritório
    </div>
    <v-row dense>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Email"
          font-size="1"
          :content="$single?.Patient?.User?.email ?? 'Não informado'"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Nome do advogado"
          font-size="1"
          :content="$single?.Patient?.User?.name ?? 'Não informado'"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          title="OAB"
          font-size="1"
          :content="$single?.Patient?.User?.oab ?? 'NNNNN'"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          title="OAB/UF"
          font-size="1"
          :content="$single?.Patient?.User?.oab ?? 'NN'"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="6">
        <InfoLabel
          title="CNPJ"
          font-size="1"
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
          font-size="1"
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
const { formatTelephoneNumber, formatCPFOrCNPJ } = useUtils();
const storeConsultation = useSolicitationConsultationStore();

const $single = computed(() => storeConsultation.$single);
</script>
