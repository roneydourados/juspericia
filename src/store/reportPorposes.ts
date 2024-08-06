import { create } from "./../server/api/benefit-type/repository/benefitTypeRepository";
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

  const show = async (id: number) => {
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

  const destroy = async (id: number) => {
    await api.delete(`/report-purposes/${id}`);
  };

  return { $single, $all, index, create, update, destroy, show };
});
