<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            <div class="text-subtitle-1 font-weight-bold">
              Dados da consulta
            </div>
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn class="text-none" @click="dialog = false">
              <strong class="text-error">Cancelar</strong>
            </v-btn>
            <v-btn class="text-none" @click="handleQueryStart">
              <strong class="text-info">Iniciar consulta</strong>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card flat rounded="lg" class="pa-4" style="overflow-y: scroll">
          <v-row dense class="px-4">
            <v-col cols="12" lg="6">
              <v-card flat rounded="lg">
                <v-row dense>
                  <v-col cols="12" lg="8">
                    <InfoLabel
                      title="Paciente"
                      font-size="1"
                      :content="`${$single?.PatientConsultation?.Patient?.name} ${$single?.PatientConsultation?.Patient?.surname}`"
                    />
                  </v-col>
                  <v-col cols="12" lg="4">
                    <InfoLabel
                      title="CPF"
                      font-size="1"
                      :content="
                        formatCPFOrCNPJ(
                          $single?.PatientConsultation?.Patient?.cpf ?? ''
                        )
                      "
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" lg="6">
                    <InfoLabel
                      title="Tipo de benefício"
                      font-size="1"
                      :content="$single?.PatientConsultation?.BenefitType?.name"
                    />
                  </v-col>
                  <v-col cols="12" lg="6">
                    <InfoLabel
                      title="Finalidade do laudo"
                      font-size="1"
                      :content="
                        $single?.PatientConsultation?.ReportPurpose?.name
                      "
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" lg="6">
              <v-card flat rounded="lg">
                <div
                  class="font-weight-bold mb-4 mt-4"
                  style="font-size: 1.2rem"
                >
                  Descrição dos fatos
                </div>
                <div v-html="$single?.PatientConsultation?.content" />
              </v-card>
              <SolicitationDetailsDocuments />
              <v-card flat rounded="lg">
                <div
                  class="font-weight-bold mb-4 mt-4"
                  style="font-size: 1.2rem"
                >
                  Motivo para correção
                </div>
                <div
                  v-html="$single?.PatientConsultation?.reasonCorrection"
                  style="overflow-y: scroll"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const { formatCPFOrCNPJ } = useUtils();
const emit = defineEmits(["start-query"]);
const scheduleStore = useScheduleStore();
const solicitationStore = useSolicitationConsultationStore();
const auth = useAuthStore();
const router = useRouter();

const $single = computed(() => scheduleStore.$single);
const $user = computed(() => auth.$currentUser);
const dialog = defineModel({ default: false });

const handleQueryStart = async () => {
  dialog.value = false;

  await solicitationStore.update({
    publicId: $single.value?.PatientConsultation?.publicId,
    isTelemedicine: true,
    medicId: $user.value?.id,
  });

  // Aqui vai abrir a tela para conversação de vídeo
  await router.push(
    `/teleconference/${$single.value?.PatientConsultation?.publicId}`
  );

  emit("start-query");
};
</script>
