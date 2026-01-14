<template>
  <v-row dense>
    <v-col cols="12" lg="2">
      <v-card rounded="xl" color="primary" height="45">
        <v-card-text class="d-flex justify-center mt-n1">
          <v-icon icon="mdi-calendar" start size="22" color="colorIcon" />
          <span class="text-white text-subtitle-2"> Mês </span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="2">
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
          <v-card class="pa-2" rounded="xl" variant="outlined" color="grey">
            <div dense class="d-flex align-center justify-center">
              <strong class="mt-1 text-subtitle-2 text-darkText">
                {{ item.month }}
              </strong>
            </div>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const monthIndex = ref(dayjs().month());

const emit = defineEmits(["month"]);

const $months = computed(() => {
  return monthsObject;
});

const selectMonth = () => {
  const selectedMonth = $months.value[monthIndex.value];
  if (selectedMonth) {
    emit("month", selectedMonth.monthIndex);
  }
};

watch(
  monthIndex,
  () => {
    selectMonth();
  },
  { immediate: true }
);

const handlePrevClick = (props: any) => {
  if (props && props.onClick) {
    props.onClick();
  }
};

const handleNextClick = (props: any) => {
  if (props && props.onClick) {
    props.onClick();
  }
};
</script>
