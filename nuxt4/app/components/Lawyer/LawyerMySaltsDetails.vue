<template>
  <DialogForm
    :show="show"
    title="Detalhes"
    @dialog="show = false"
    :width="mobile ? '100%' : '80%'"
    border-color="#c8e040"
  >
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <Table
              :headers="headers"
              :items="$single"
              :show-crud="false"
              title="Histórico"
            >
              <template #item.createdAt="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ item.createdAt }}
                </strong>
              </template>
              <template #item.history="{ item }">
                <span>
                  {{ item.history }}
                </span>
              </template>
              <template #item.type="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ item.type }}
                </strong>
              </template>
              <template #item.value="{ item }">
                <strong style="font-size: 0.8rem">
                  {{ amountFormated(item.value, false) }}
                </strong>
              </template>
              <template #item.solicitationId="{ item }">
                <Button
                  v-if="item.solicitationId"
                  variant="outlined"
                  color="grey"
                  @click="getSolicitationDetails(item.consultationPublicId)"
                >
                  <strong
                    style="font-size: 0.8rem"
                    class="text-colorTextPrimary"
                  >
                    {{ item.solicitationId }}
                  </strong>
                </Button>
                <span v-else> Sem solicitação </span>
              </template>
            </Table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <LawyerMySaltsDetailsSolicitation v-model="showSolicitation" />
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const show = defineModel({
  default: false,
});

const saltCredit = useUserCreditSaltStore();
const storeConsultation = useSolicitationConsultationStore();
const { amountFormated } = useUtils();
const { mobile } = useDisplay();

const $single = computed(() => saltCredit.$userCreditLog);
const showSolicitation = ref(false);
const headers = ref([
  {
    title: "Data",
    key: "createdAt",
    width: "20%",
  },
  {
    title: "Histórico",
    key: "history",
  },
  {
    title: "Tipo",
    key: "type",
  },
  {
    title: "Valor",
    key: "value",
  },
  {
    title: "Nº Solicitação",
    key: "solicitationId",
    width: "12%",
  },
  {
    title: "Solicitação Status",
    key: "solicitationStatus",
    width: "15%",
  },
]);

const getSolicitationDetails = async (publicId: string) => {
  await storeConsultation.show(publicId);
  showSolicitation.value = true;
};
</script>
