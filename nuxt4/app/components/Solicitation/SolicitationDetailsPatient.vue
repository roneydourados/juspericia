<template>
  <div>
    <div
      class="font-weight-bold mb-4 mt-4 text-primary"
      :style="`${mobile ? 'font-size: 0.8rem' : 'font-size: 1.2rem'}`"
    >
      Dados do paciente
    </div>
    <v-row dense class="text-primary">
      <v-col cols="12" lg="8">
        <InfoLabel
          title="Paciente"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="`${$single?.Patient?.name} ${$single?.Patient?.surname}`"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="CPF"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="formatCPFOrCNPJ($single?.Patient?.cpf ?? '')"
        />
      </v-col>
      <v-col v-if="$currentUser?.profile?.type !== 'MEDICO'" cols="12" lg="4">
        <InfoLabel
          title="Telefone"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="formatTelephoneNumber($single?.Patient?.phone ?? '')"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="RG"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.Patient?.rg ?? 'NT'"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Nascimento"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="`${dayjs($single?.Patient?.birthDate).format(
            'DD/MM/YYYY'
          )} - ${
            $single?.Patient?.birthDate ? age($single?.Patient?.birthDate) : ''
          }`"
        />
      </v-col>
      <v-col cols="12">
        <InfoLabel
          title="Nome da mãe"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.Patient?.motherName ?? 'Não informado'"
        />
      </v-col>
      <v-col v-if="$currentUser?.profile?.type !== 'MEDICO'" cols="12">
        <InfoLabel
          title="Email"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.Patient?.email ?? 'Não informado'"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const auth = useAuthStore();
const { formatTelephoneNumber, formatCPFOrCNPJ, age } = useUtils();
const storeConsultation = useSolicitationConsultationStore();

const $single = computed(() => storeConsultation.$single);
const $currentUser = computed(() => auth.$currentUser);
</script>
