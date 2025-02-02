<template>
  <div>
    <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
      Dados do paciente
    </div>
    <v-row dense>
      <v-col cols="12" lg="8">
        <InfoLabel
          title="Paciente"
          font-size="1"
          :content="`${$single?.Patient?.name} ${$single?.Patient?.surname}`"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="CPF"
          font-size="1"
          :content="formatCPFOrCNPJ($single?.Patient?.cpf ?? '')"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Telefone"
          font-size="1"
          :content="formatTelephoneNumber($single?.Patient?.phone ?? '')"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="RG"
          font-size="1"
          :content="$single?.Patient?.rg ?? 'NT'"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Nascimento"
          font-size="1"
          :content="`${moment($single?.Patient?.birthDate).format(
            'DD/MM/YYYY'
          )} - ${
            $single?.Patient?.birthDate ? age($single?.Patient?.birthDate) : ''
          }`"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <InfoLabel
          title="Nome da mãe"
          font-size="1"
          :content="$single?.Patient?.motherName ?? 'Não informado'"
        />
      </v-col>
      <v-col cols="12">
        <InfoLabel
          title="Email"
          font-size="1"
          :content="$single?.Patient?.email ?? 'Não informado'"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";

const { formatTelephoneNumber, formatCPFOrCNPJ, age } = useUtils();
const storeConsultation = useSolicitationConsultationStore();

const $single = computed(() => storeConsultation.$single);
</script>
