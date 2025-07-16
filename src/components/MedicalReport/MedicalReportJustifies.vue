<template>
  <DialogForm
    title="Justificativas"
    :show="show"
    @dialog="show = false"
    ok-text="OK"
    :width="mobile ? '100%' : '70%'"
  >
    <v-card>
      <v-card-text>
        <Table
          title="Justificativas cadastras "
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
      </v-card-text>
    </v-card>
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
