<template>
  <v-card flat rounded="lg" color="transparent" class="px-6">
    <v-card-title class="mb-12 d-flex align-center justify-space-between">
      <span class="font-weight-bold"> Solicitações </span>
      <v-btn
        class="text-none"
        color="primary"
        size="small"
        prepend-icon="mdi-plus"
      >
        Nova solicitação
      </v-btn>
    </v-card-title>

    <v-tabs
      v-model="tab"
      color="primary"
      :grow="mobile"
      @update:model-value="handleChangeTable"
    >
      <v-tab :value="1" class="text-none">
        <v-icon icon="mdi-file-clock-outline" size="24" start />
        <span v-if="!mobile"> Pendentes </span>
      </v-tab>
      <v-tab :value="2" class="text-none">
        <v-icon icon="mdi-file-check-outline" size="24" start />
        <span v-if="!mobile"> Agendadas </span>
      </v-tab>
      <v-tab :value="3" class="text-none">
        <v-icon icon="mdi-calendar-month-outline" size="24" start />
        <span v-if="!mobile">Finalizadas </span>
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-card-text>
      <v-row v-for="item in solicitations" :key="item.id" dense>
        <v-col cols="12">
          <SolicitationTableItem :solicitation="item" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const tab = ref(1);

const solicitations = ref([
  {
    id: 1,
    date: "15/07/2024 11:40",
    solicitante: "João da Silva",
    processNumber: "999.0235544.225641-335875",
    status: "Pendente",
    value: "R$ 145,00",
    antecipationValue: "R$ 80,00",
    total: "R$ 225,00",
    patient: "Fulano de tal paciente da silva",
    medic: "Dr. Ciclado da Silva",
    crm: "2547/MS",
    deadline: "30/07/2024",
    title: "Solicitação 1",
  },
  {
    id: 2,
    date: "16/07/2024 09:20",
    solicitante: "Maria Souza",
    processNumber: "999.0235544.225641-335876",
    status: "Agendada",
    value: "R$ 200,00",
    antecipationValue: "R$ 100,00",
    total: "R$ 300,00",
    patient: "Beltrano de tal paciente da silva",
    medic: "Dr. Roberto Almeida",
    crm: "1234/SP",
    deadline: "31/07/2024",
    title: "Solicitação 2",
  },
  {
    id: 3,
    date: "17/07/2024 14:30",
    solicitante: "Pedro Santos",
    processNumber: "999.0235544.225641-335877",
    status: "Finalizada",
    value: "R$ 180,00",
    antecipationValue: "R$ 90,00",
    total: "R$ 270,00",
    patient: "Ciclana de tal paciente da silva",
    medic: "Dr. Ana Maria",
    crm: "5678/RJ",
    deadline: "01/08/2024",
    title: "Solicitação 3",
  },
  {
    id: 4,
    date: "18/07/2024 16:50",
    solicitante: "José Oliveira",
    processNumber: "999.0235544.225641-335878",
    status: "Pendente",
    value: "R$ 160,00",
    antecipationValue: "R$ 85,00",
    total: "R$ 245,00",
    patient: "Beltrana de tal paciente da silva",
    medic: "Dr. Carlos Alberto",
    crm: "9876/PR",
    deadline: "02/08/2024",
    title: "Solicitação 4",
  },
  {
    id: 5,
    date: "19/07/2024 10:15",
    solicitante: "Ana Rodrigues",
    processNumber: "999.0235544.225641-335879",
    status: "Agendada",
    value: "R$ 220,00",
    antecipationValue: "R$ 110,00",
    total: "R$ 330,00",
    patient: "Ciclano de tal paciente da silva",
    medic: "Dr. Maria Fernanda",
    crm: "4321/BA",
    deadline: "03/08/2024",
    title: "Solicitação 5",
  },
  {
    id: 6,
    date: "20/07/2024 13:00",
    solicitante: "Mariana Costa",
    processNumber: "999.0235544.225641-335880",
    status: "Finalizada",
    value: "R$ 190,00",
    antecipationValue: "R$ 95,00",
    total: "R$ 285,00",
    patient: "Fulaninho de tal paciente da silva",
    medic: "Dr. José Carlos",
    crm: "1357/SC",
    deadline: "04/08/2024",
    title: "Solicitação 6",
  },
  {
    id: 7,
    date: "21/07/2024 15:30",
    solicitante: "Ricardo Alves",
    processNumber: "999.0235544.225641-335881",
    status: "Pendente",
    value: "R$ 170,00",
    antecipationValue: "R$ 90,00",
    total: "R$ 260,00",
    patient: "Beltraninho de tal paciente da silva",
    medic: "Dr. Marcelo Silva",
    crm: "7531/MG",
    deadline: "05/08/2024",
    title: "Solicitação 7",
  },
  {
    id: 8,
    date: "22/07/2024 17:45",
    solicitante: "Carla Mendes",
    processNumber: "999.0235544.225641-335882",
    status: "Agendada",
    value: "R$ 210,00",
    antecipationValue: "R$ 105,00",
    total: "R$ 315,00",
    patient: "Ciclaninho de tal paciente da silva",
    medic: "Dr. Luiz Carlos",
    crm: "8642/GO",
    deadline: "06/08/2024",
    title: "Solicitação 8",
  },
  {
    id: 9,
    date: "23/07/2024 11:10",
    solicitante: "Fernanda Lima",
    processNumber: "999.0235544.225641-335883",
    status: "Finalizada",
    value: "R$ 230,00",
    antecipationValue: "R$ 115,00",
    total: "R$ 345,00",
    patient: "Beltraninha de tal paciente da silva",
    medic: "Dr. Rafaela Santos",
    crm: "9753/RS",
    deadline: "07/08/2024",
    title: "Solicitação 9",
  },
  {
    id: 10,
    date: "24/07/2024 09:30",
    solicitante: "Gustavo Ferreira",
    processNumber: "999.0235544.225641-335884",
    status: "Pendente",
    value: "R$ 250,00",
    antecipationValue: "R$ 125,00",
    total: "R$ 375,00",
    patient: "Ciclaninha de tal paciente da silva",
    medic: "Dr. Pedro Henrique",
    crm: "2468/MT",
    deadline: "08/08/2024",
    title: "Solicitação 10",
  },
]);

const handleChangeTable = () => {
  console.log(tab.value);
};
</script>
