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
          <v-card-title class="d-flex justify-space-between px-2">
            <strong>
              Data Solicitação de correção:
              {{ dayjs(item.createdAt).format("DD/MM/YYYY HH:mm") }}
            </strong>
            <v-chip
              :color="`${item.status === 'open' ? 'warning' : 'green'}`"
              variant="flat"
            >
              <v-icon
                :icon="`${
                  item.status === 'open' ? 'mdi-circle-outline' : 'mdi-check'
                }`"
                start
                color="colorIcon"
              />
              <span class="text-capton">
                {{ item.status === "open" ? "Pendente" : "Resolvido" }}
              </span>
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div v-html="item.correctionReason" />
          </v-card-text>
          <v-card-actions
            v-if="$user?.profile?.type !== 'ADVOGADO'"
            class="d-flex justify-end pa-2"
          >
            <Button
              color="primary"
              variant="outlined"
              @click="resolveCorrection(item)"
              :disabled="item.status !== 'open'"
            >
              <v-icon icon="mdi-check" start color="colorIcon" />
              <span class="text-capton"> Marcar como resolvido </span>
            </Button>
          </v-card-actions>
        </CardBlur>
      </v-col>
    </v-row>
    <DialogLoading :dialog="loading" />
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
const auth = useAuthStore();
const consultationReport = usePatientConsultationReportStore();
const patientConsultationStore = useSolicitationConsultationStore();

const loading = ref(false);

const $single = computed(() => consultationReport.$single);
const $user = computed(() => auth.$currentUser);

const show = defineModel({
  type: Boolean,
  default: false,
});

const resolveCorrection = (item: SolicitationCorrectionProps) => {
  push.info({
    title: "Marcar como resolvido a correção",
    message: "Confirma que já foi resolvida esta correção ?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Resolver",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              if (!item.publicId) {
                return;
              }
              await patientConsultationStore.closeSolicitationCorrection(
                item.publicId
              );

              await consultationReport.show($single.value?.publicId!);
              //show.value = false;
            } catch (error) {
              show.value = false;
              push.error("Erro ao resolver correção");
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Cancelar",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};
</script>
