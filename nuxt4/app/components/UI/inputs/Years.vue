<template>
  <div class="d-flex flex-column align-center">
    <strong v-if="showTitle">Ano</strong>
    <v-carousel v-model="yearIndex" hide-delimiters height="50">
      <template v-slot:prev="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-left"
          variant="tonal"
          @click="handlePrevClick(props)"
        />
      </template>
      <template v-slot:next="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-right"
          variant="tonal"
          @click="handleNextClick(props)"
        />
      </template>
      <v-carousel-item v-for="item in $years" :key="item.year">
        <v-sheet height="100%">
          <div class="d-flex fill-height justify-center align-center">
            <strong style="font-size: 1rem">{{ item.year }}</strong>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

defineProps({
  showTitle: {
    type: Boolean,
    default: false,
  },
});
const yearIndex = ref(dayjs().year());

const emit = defineEmits(["year"]);

const $years = computed(() => {
  const years = [];
  const currentYear = dayjs().year();

  for (let i = 1970; i <= currentYear + 20; i++) {
    years.push({
      year: i,
    });
  }
  return years;
});

onMounted(() => {
  const currentYear = dayjs().year();
  const index = $years.value.findIndex((year) => year.year === currentYear);
  yearIndex.value = index;
});

const selectYear = () => {
  const selected = $years.value[yearIndex.value];
  if (selected) {
    emit("year", selected.year);
  }
};

// Métodos para lidar com os cliques
const handlePrevClick = (props: any) => {
  if (props && props.onClick) {
    props.onClick();
  }

  selectYear();
};

const handleNextClick = (props: any) => {
  if (props && props.onClick) {
    props.onClick();
  }

  selectYear();
};
</script>
