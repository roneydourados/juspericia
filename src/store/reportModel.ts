import { ReportModelProps } from "@/types/Patient";
import { defineStore } from "pinia";

export const useReportModelStore = defineStore("reportModel", () => {
  const { api } = useAxios();

  const reportModel = ref<ReportModelProps>();
  const reportModels = ref<ReportModelProps[]>([]);

  const $all = computed(() => reportModels.value);
  const $single = computed(() => reportModel.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        inputQuery,
      },
    };

    const { data } = await api.get<ReportModelProps[]>(
      "/report-models",
      config
    );

    reportModels.value = data;
  };

  const update = async (payload: ReportModelProps) => {
    const { data } = await api.put<ReportModelProps>("/report-models", payload);

    reportModel.value = data;
  };

  const create = async (payload: ReportModelProps) => {
    const { data } = await api.post<ReportModelProps>(
      "/report-models",
      payload
    );

    reportModel.value = data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/report-models/${id}`);
  };

  const show = async (id: string) => {
    const { data } = await api.get<ReportModelProps>(`/report-models/${id}`);

    reportModel.value = data;
  };

  return {
    $all,
    $single,
    create,
    index,
    update,
    destroy,
    show,
  };
});
