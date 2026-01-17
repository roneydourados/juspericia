<template>
  <div style="font-size: 1.2rem; font-weight: 700" class="my-4">
    Atendimentos
    <div class="d-flex align-center" v-if="isTimerActive" style="gap: 0.5rem">
      <span class="text-primary font-weight-bold">
        Próxima atualização em
      </span>
      <v-progress-circular
        :model-value="
          ((countDownDefaultValue - countdown) / countDownDefaultValue) * 100
        "
        size="30"
        width="3"
        color="primary"
      >
        <span class="text-caption">{{ countdown }}</span>
      </v-progress-circular>
      <Button variant="outlined" @click="handleFilterData" class="ml-4">
        <v-icon icon="mdi-reload" start color="colorIcon" />
        <span class="text-primary"> Atualizar </span>
      </Button>

      <Button variant="outlined" @click="router.back()" class="ml-2">
        <v-icon icon="mdi-arrow-left" start color="colorIcon" />
        <span class="text-primary"> voltar </span>
      </Button>
    </div>
  </div>
  <v-row>
    <v-col v-for="item in $nuvidioDepartments" :key="item.id" cols="12" lg="4">
      <CardBlur @click="handleGetDetails(item)" height="100%">
        <v-card-title>
          <v-icon icon="mdi-headset" start size="40" color="colorIcon" />
          Departamento
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-column mt-4" style="gap: 0.5rem">
            <span>
              <v-icon icon="mdi-stethoscope" start color="info" />
              {{ item.name }}
            </span>
            <div class="d-flex align-center">
              <v-icon icon="mdi-account" start color="info" />
              <span>
                Fila espera: <strong>{{ item.queueQuantity ?? 0 }}</strong>
              </span>
            </div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-headset" start color="green-darken-1" />
              <span>
                Atendendo: <strong>{{ item.callQuantity ?? 0 }}</strong>
              </span>
            </div>
          </div>
        </v-card-text>
      </CardBlur>
    </v-col>
  </v-row>
  <DialogLoading :dialog="loading" />
  <AtendmentsDetails v-model="showDetails" @close="startCountdown" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const nuvidioStore = useNuvidioStore();
const router = useRouter();

const countDownDefaultValue = 30;

const autoRefreshInterval = ref<NodeJS.Timeout | null>(null);
const countdown = ref(countDownDefaultValue);
const isTimerActive = ref(false);
const countdownInterval = ref<NodeJS.Timeout | null>(null);
const loading = ref(false);
const showDetails = ref(false);
const filters = ref({
  department: "",
  initialDate: dayjs().format("YYYY-MM-DD"),
  finalDate: dayjs().format("YYYY-MM-DD"),
  hookType: "",
  departmentId: undefined,
});

const $nuvidioDepartments = computed(() => {
  //Departamento Dr(a). Roney Melo
  return nuvidioStore.$nuvidioDepartments.map((dept) => {
    dept.name = dept.name.replace(/Departamento Dr\(a\)\.\s*/i, "");
    return dept;
  });
});

onMounted(async () => {
  await handleGetNuvidioDepartments();
  startAutoRefresh();
  startCountdown(); // Start initial countdown
});

// Clean up interval when component is unmounted
onUnmounted(() => {
  stopAutoRefresh();
});

// Start the auto-refresh interval (agora usa intervalo fixo)
const startAutoRefresh = () => {
  // Limpa qualquer intervalo anterior
  stopAutoRefresh();

  // Usa intervalo fixo baseado no valor padrão do countdown
  autoRefreshInterval.value = setInterval(async () => {
    await refreshAndRestart();
  }, countDownDefaultValue * 1000);
};

const refreshAndRestart = async () => {
  await handleGetNuvidioDepartments();
  startCountdown();
};

const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
    autoRefreshInterval.value = null;
  }
  stopCountdown(); // Also stop countdown when stopping auto refresh
};

const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
    countdownInterval.value = null;
  }
  isTimerActive.value = false;
};

const startCountdown = () => {
  // Limpa qualquer countdown anterior para evitar múltiplos intervalos
  stopCountdown();

  countdown.value = countDownDefaultValue;
  isTimerActive.value = true;

  countdownInterval.value = setInterval(async () => {
    countdown.value--;

    if (countdown.value <= 0) {
      stopCountdown();
      // Quando o countdown termina, executa o refresh e reinicia
      await refreshAndRestart();
    }
  }, 1000);
};

const handleFilterData = async () => {
  stopCountdown();
  await handleGetNuvidioDepartments();
  startCountdown();
};

const handleGetNuvidioDepartments = async () => {
  loading.value = true;
  try {
    await nuvidioStore.getNuvidioDepartments(filters.value.department);
  } finally {
    loading.value = false;
  }
};

const handleGetDetails = async (item: NuvidioDepartmentProps) => {
  loading.value = true;
  try {
    await nuvidioStore.getDepartmentDetails(item.id);
    showDetails.value = true;
    stopCountdown();
  } finally {
    loading.value = false;
  }
};
</script>
