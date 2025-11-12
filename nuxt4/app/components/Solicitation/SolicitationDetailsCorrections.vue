<template>
  <CardBlur style="border-top: 6px solid #c7d82f">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <strong class="text-primary" style="font-size: 1.1rem">
          Correção
        </strong>
        <v-chip :color="data?.status === 'open' ? 'orange' : 'green'">
          {{ data?.status === "open" ? "Aberta" : "Fechada" }}
        </v-chip>
      </div>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          Data:
          <strong>
            {{ dayjs(data?.createdAt).format("DD/MM/YYYY HH:mm") }}
          </strong>
          Data ultima atualização:
          <strong>
            {{ dayjs(data?.updatedAt).format("DD/MM/YYYY HH:mm") }}
          </strong>
        </v-col>
      </v-row>
      <strong class="text-primary">
        {{ data?.correctionReason }}
      </strong>
    </v-card-text>
    <v-card-actions class="d-flex justify-end" style="gap: 0.5rem">
      <Button
        v-if="$currentUser?.profile?.type === 'ADMIN'"
        class="text-none font-weight-bold"
        @click="closeSolicitationCorrection(data.publicId!)"
        size="small"
        variant="outlined"
        color="primary"
        :disabled="data?.status !== 'open'"
      >
        <v-icon icon="mdi-check" color="colorIcon" start />
        <span class="text-caption"> Finalizar </span>
      </Button>
      <Button
        class="text-none font-weight-bold"
        @click="deleteSolicitationCorrection(data.publicId!)"
        size="small"
        variant="text"
        color="red"
        :disabled="data?.status !== 'open'"
      >
        <v-icon icon="mdi-delete" color="red" start />
        <span class="text-caption font-weight-bold"> Apagar </span>
      </Button>
    </v-card-actions>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const props = defineProps({
  data: {
    type: Object as PropType<SolicitationCorrectionProps>,
    required: true,
  },
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    required: true,
  },
});

const storeConsultation = useSolicitationConsultationStore();
const authStore = useAuthStore();

const $currentUser = computed(() => authStore.$currentUser);

const deleteSolicitationCorrection = async (publicId: string) => {
  push.info({
    title: "Apagar solicitação de correção ?",
    message: "Tem certeza que deseja apagar a solicitação de correção ?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Apagar",
          variant: "primary",
          icon: "mdi-delete-outline",
          iconColor: "colorIcon",
          handler: async () => {
            try {
              await storeConsultation.deleteSolicitationCorrection(publicId);
              await storeConsultation.show(props.solicitation.publicId!);
            } catch (error) {
              console.log("🚀 ~ deleteSolicitationCorrection ~ error:", error);
              push.error("Erro ao apagar correção.");
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

const closeSolicitationCorrection = async (publicId: string) => {
  push.info({
    title: "Finalizar solicitação de correção ?",
    message: "Tem certeza que deseja finalizar a solicitação de correção ?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Finalizar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            try {
              await storeConsultation.closeSolicitationCorrection(publicId);
              await storeConsultation.show(props.solicitation.publicId!);
            } catch (error) {
              console.log("🚀 ~ closeSolicitationCorrection ~ error:", error);
              push.error("Erro ao fechar correção.");
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
