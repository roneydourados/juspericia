<template>
  <DialogForm :title="item?.name" :show="show" @dialog="handleClose" fullscreen>
    <CardBlur :hover="false">
      <v-row dense>
        <v-col cols="12">
          <Tabs
            v-model="tabFilter"
            :tabs="tabsFilter"
            @update:model-value="handleChangeTabFilter"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <AdminCreditSaltsDetailsSolicitationBenefitTypes />
        </v-col>
        <v-col cols="12" lg="6">
          <AdminCreditSaltsDetailsSolicitationReportPropuseChart />
        </v-col>
        <v-col cols="12">
          <AdminCreditSaltsDetailsSolicitations />
        </v-col>
        <v-col cols="12">
          <AdminCreditSaltsDetailsUserCredits />
        </v-col>
      </v-row>
      <!-- <pre>{{ $estatisticsByAdmin }}</pre> -->
    </CardBlur>
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps({
  item: {
    type: Object as PropType<LawyerEstatisticsByAdmin>,
    default: () => undefined,
  },
});

const emit = defineEmits(["close"]);

const userLaywerStore = useUserLawyerStore();
const tabFilter = ref(4);
const tabsFilter = ref<TabProps[]>([
  {
    title: "Hoje",
    icon: "",
    colorIcon: "colorIcon",
  },
  {
    title: "Semana",
    icon: "",
    colorIcon: "colorIcon",
  },
  {
    title: "Mês",
    icon: "",
    colorIcon: "colorIcon",
  },
  {
    title: "Ano",
    icon: "",
    colorIcon: "colorIcon",
  },
  {
    title: "Tudo",
    icon: "",
    colorIcon: "colorIcon",
  },
]);

const filters = ref({
  initialDate: dayjs().startOf("year").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("year").format("YYYY-MM-DD"),
});

const $estatisticsByAdmin = computed(() => {
  return userLaywerStore.$estatisticsByAdmin;
});

const show = defineModel({
  default: false,
});

watch(
  () => show.value,
  async (value) => {
    if (value && props.item) {
      await userLaywerStore.getEstatisticsByAdmin({
        ...filters.value,
        userId: props.item.id!,
      });
    }
  }
);

const handleClose = () => {
  show.value = false;
  emit("close");
};

const handleChangeTabFilter = async () => {
  switch (tabFilter.value) {
    case 1:
      filters.value.initialDate = dayjs().format("YYYY-MM-DD");
      filters.value.finalDate = dayjs().format("YYYY-MM-DD");
      break;
    case 2:
      filters.value.initialDate = dayjs().startOf("week").format("YYYY-MM-DD");
      filters.value.finalDate = dayjs().endOf("week").format("YYYY-MM-DD");
      break;
    case 3:
      filters.value.initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
      filters.value.finalDate = dayjs().endOf("month").format("YYYY-MM-DD");
      break;
    case 4:
      filters.value.initialDate = dayjs().startOf("year").format("YYYY-MM-DD");
      filters.value.finalDate = dayjs().endOf("year").format("YYYY-MM-DD");
      break;
    case 5:
      filters.value.initialDate = "1972-01-01";
      filters.value.finalDate = dayjs().endOf("year").format("YYYY-MM-DD");
      break;
  }

  if (!props.item) return;

  await userLaywerStore.getEstatisticsByAdmin({
    ...filters.value,
    userId: props.item.id!,
  });
};
</script>
