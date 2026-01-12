<template>
  <DialogForm
    :show="show"
    title="Histórico da Solicitação"
    @dialog="show = false"
    max-width="800"
  >
    <v-card flat>
      <v-card-text v-if="$histories && $histories.length > 0" class="pa-4">
        <v-timeline
          :density="mobile ? 'compact' : undefined"
          truncate-line="both"
        >
          <v-timeline-item
            v-for="history in $histories"
            :key="history.id"
            dot-color="primary"
            size="x-small"
            fill-dot
            icon="mdi-history"
          >
            <template v-slot:opposite>
              {{ dayjs(history.createdAt).format("DD/MM/YYYY HH:mm") }}
            </template>

            <CardBlur color="grey-lighten-3">
              <v-card-text class="py-3">
                <div class="d-flex align-center mb-2">
                  <v-avatar size="32" color="primary" class="mr-2">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-2 font-weight-bold">
                      {{ history.user.name }}
                    </div>
                    <div class="text-caption text-grey">
                      {{ history.user.email }}
                    </div>
                    <div class="text-caption text-grey">
                      {{ dayjs(history.createdAt).format("DD/MM/YYYY HH:mm") }}
                    </div>
                  </div>
                </div>
                <div class="text-body-2 mt-2">
                  {{ history.content }}
                </div>
              </v-card-text>
            </CardBlur>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>

      <v-card-text v-else class="text-center pa-8">
        <v-icon size="64" color="grey-lighten-2" class="mb-4">
          mdi-history
        </v-icon>
        <div class="text-h6 text-grey">Nenhum histórico disponível</div>
        <div class="text-caption text-grey-darken-1 mt-2">
          Ainda não há registros de alterações para esta solicitação
        </div>
      </v-card-text>
    </v-card>
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const storeConsultation = useSolicitationConsultationStore();

const $histories = computed(() => storeConsultation.$solicitationHistories);

const show = defineModel("show", {
  default: false,
});
</script>
