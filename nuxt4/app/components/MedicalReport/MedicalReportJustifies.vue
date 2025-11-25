<template>
  <DialogForm
    title="Justificativas cadastradas"
    :show="show"
    @dialog="show = false"
    ok-text="OK"
    :width="mobile ? '100%' : '70%'"
    border-color="#002c9b"
  >
    <v-row dense>
      <v-col
        cols="12"
        v-for="item in $single?.PatientConsultation?.corrections"
        :key="item.id"
      >
        <CardBlur>
          <v-card-title>
            <strong>
              Data Solicitação de correção:
              {{ dayjs(item.createdAt).format("DD/MM/YYYY HH:mm") }}
            </strong>
          </v-card-title>
          <v-card-text>
            <div v-html="item.correctionReason" />
          </v-card-text>
        </CardBlur>
      </v-col>
    </v-row>
    <!-- <Table
      title=""
      font-size="1.5rem"
      :headers="headers"
      :items="$single?.justifies"
      :show-crud="false"
    >
      <template v-slot:item.createdAt="{ item }">
        {{ dayjs(item.createdAt).format("DD/MM/YYYY HH:mm") }}
      </template>
      <template v-slot:item.user.name="{ item }">
        <strong>{{ item.user.name }}</strong>
      </template>
    </Table> 
    <pre>{{ $single?.PatientConsultation?.corrections }}</pre>
    -->
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
//const { formatDate } = useUtils();
const consultationReport = usePatientConsultationReportStore();
const $single = computed(() => consultationReport.$single);

const show = defineModel({
  type: Boolean,
  default: false,
});

const headers = [
  { title: "Descrição", key: "justify", width: "50%" },
  { title: "Usuário justificou", key: "user.name" },
  { title: "Data/Hora", key: "createdAt" },
];
</script>
