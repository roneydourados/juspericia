<template>
  <DialogForm
    :show="show"
    title="Detalhes do departamento"
    width="700"
    @dialog="handleClose"
  >
    <v-row
      v-if="
        ($nuvidioDepartmentDetails?.clientInCall?.length ?? 0) > 0 ||
        ($nuvidioDepartmentDetails?.clientQueue?.length ?? 0) > 0
      "
    >
      <v-col cols="12" lg="6">
        <div class="w-100 text-center">
          <strong>Fila de espera</strong>
        </div>
        <div
          v-for="item in $nuvidioDepartmentDetails?.clientQueue"
          :key="item.id"
        >
          <CardBlur height="100%">
            <v-card-text>
              <div class="d-flex flex-column" style="gap: 0.5rem">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-account" start color="info" />
                  {{ item.customerName }}
                </div>
                <div class="d-flex align-center">
                  <v-icon
                    icon="mdi-clock-outline"
                    start
                    color="orange-darken-1"
                  />
                  <span>
                    Entrou as:
                    <strong>{{ dayjs(item.createdAt).format("HH:mm") }}</strong>
                  </span>
                </div>
              </div>
            </v-card-text>
          </CardBlur>
        </div>
      </v-col>
      <v-col cols="12" lg="6">
        <div class="w-100 text-center">
          <strong>Em Atendimento</strong>
        </div>
        <div
          v-for="item in $nuvidioDepartmentDetails?.clientInCall"
          :key="item.id"
        >
          <CardBlur height="100%" class="mb-2">
            <v-card-text>
              <div class="d-flex flex-column" style="gap: 0.5rem">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-account" start color="info" />
                  {{ item.customerName }}
                </div>
                <div class="d-flex align-center">
                  <v-icon icon="mdi-headset" start color="green-darken-1" />
                  <span>
                    Iniciado as:
                    <strong>{{ dayjs(item.createdAt).format("HH:mm") }}</strong>
                  </span>
                </div>
              </div>
            </v-card-text>
          </CardBlur>
        </div>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <CardBlur height="100%" class="mb-2">
          <v-card-text>
            <div class="d-flex flex-column align-center justify-center">
              <v-icon
                icon="mdi-clock-outline"
                start
                color="grey-lighten-1"
                size="40"
              />
              <span class="text-grey-darken-1 mt-2" style="font-size: 1.2rem">
                Sem dados
              </span>
            </div>
          </v-card-text>
        </CardBlur>
      </v-col>
    </v-row>
    <!-- <pre>{{ $nuvidioWebhookEvents }}</pre> -->
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const emit = defineEmits(["close"]);

const nuvidioStore = useNuvidioStore();

const show = defineModel({
  default: false,
});

const $nuvidioDepartmentDetails = computed(
  () => nuvidioStore.$nuvidioDepartmentDetails,
);

const handleClose = () => {
  emit("close");
  show.value = false;
};
</script>
