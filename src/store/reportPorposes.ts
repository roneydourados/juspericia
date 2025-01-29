import { defineStore } from "pinia";

export const useReportPorposesStore = defineStore("reportPorposes", () => {
  const { api } = useAxios();

  const reportPurpose = ref<ReportPurposeProps>();
  const reportPurposes = ref<ReportPurposeProps[]>([]);

  const $single = computed(() => reportPurpose.value);
  const $all = computed(() => reportPurposes.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        inputQuery,
      },
    };

    const { data } = await api.get<ReportPurposeProps[]>(
      "/report-purposes",
      config
    );

    reportPurposes.value = data;
  };

  const show = async (id: string) => {
    const { data } = await api.get<ReportPurposeProps>(
      `/report-purposes/${id}`
    );

    reportPurpose.value = data;
  };

  const create = async (input: ReportPurposeProps) => {
    const { data } = await api.post<ReportPurposeProps>(
      "/report-purposes",
      input
    );

    reportPurpose.value = data;
  };

  const update = async (input: ReportPurposeProps) => {
    const { data } = await api.put<ReportPurposeProps>(
      "/report-purposes",
      input
    );

    reportPurpose.value = data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/report-purposes/${id}`);
  };

  return { $single, $all, index, create, update, destroy, show };
});
