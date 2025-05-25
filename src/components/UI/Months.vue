<template>
  <div>
    <v-carousel v-model="monthIndex" hide-delimiters height="50">
      <template v-slot:prev="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-left"
          variant="text"
          @click="handlePrevClick(props)"
        />
      </template>
      <template v-slot:next="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-right"
          variant="text"
          @click="handleNextClick(props)"
        />
      </template>
      <v-carousel-item v-for="item in $months" :key="item.monthIndex">
        <v-card flat class="pa-2" rounded="lg" color="background">
          <div dense class="d-flex align-center justify-center">
            <strong style="font-size: 1rem" class="mt-1">
              {{ item.month }}
            </strong>
          </div>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const monthIndex = ref(dayjs().month());

const emit = defineEmits(["month"]);

const $months = computed(() => {
  return monthsObject;
});

onMounted(() => {
  const currentMonth = dayjs().month();
  const index = $months.value.findIndex(
    (month) => month.monthIndex === currentMonth
  );
  monthIndex.value = index;
});

const selectMonth = () => {
  emit("month", $months.value[monthIndex.value].monthIndex);
};

// Métodos para lidar com os cliques
const handlePrevClick = (props: any) => {
  if (props && props.onClick) {
    props.onClick();
  }

  selectMonth();
};

const handleNextClick = (props: any) => {
  if (props && props.onClick) {
    props.onClick();
  }

  selectMonth();
};
</script>
