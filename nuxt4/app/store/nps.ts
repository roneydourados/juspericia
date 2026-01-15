import { defineStore } from "pinia";

export const useNpsStore = defineStore("nps", () => {
  const { api } = useAxios();
  const npsList = ref<NPSProps[]>([]);
  const npsDahsboard = ref<NPSDashboardMetricsDTO>();

  const $npsList = computed(() => npsList.value);
  const $npsDahsboard = computed(() => npsDahsboard.value);

  //pegar as avaliações NPS pendentes do usuário logado
  const getNpsPending = async () => {
    const { data } = await api.get<NPSProps[]>("/nps/pending");
    npsList.value = data;
  };

  //usuário logado criar um nps
  const createNps = async (npsData: NPSCreateProps) => {
    await api.post<NPSProps>("/nps/evaluations", npsData);
  };

  const getNpsDashboard = async (filters: { monthReference: string }) => {
    const { monthReference } = filters;

    const config = {
      params: {
        monthReference,
      },
    };

    const { data } = await api.get<NPSDashboardMetricsDTO>(
      "/nps/dashboard",
      config
    );

    npsDahsboard.value = data;
  };

  const checkUserEligibleForNps = async (
    monthRef: string
  ): Promise<boolean> => {
    const config = {
      params: {
        monthRef,
      },
    };

    const { data } = await api.get<{
      isEligible: boolean;
    }>("/nps/check-general-eligibility", config);

    return data.isEligible;
  };

  const userStoreNpsGeneral = async (input: {
    rating: 1 | 2 | 3 | 4 | 5;
    monthRef: string;
    feedbackText?: string;
  }) => {
    const { rating, monthRef, feedbackText } = input;
    const npsData = {
      rating,
      monthRef,
      feedbackText,
    };
    await api.post("/nps/general-evaluation", npsData);
  };

  return {
    $npsList,
    $npsDahsboard,
    getNpsPending,
    createNps,
    getNpsDashboard,
    checkUserEligibleForNps,
    userStoreNpsGeneral,
  };
});
