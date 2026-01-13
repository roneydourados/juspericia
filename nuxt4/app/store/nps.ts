import { defineStore } from "pinia";

export const useNpsStore = defineStore("nps", () => {
  const { api } = useAxios();
  const npsList = ref<NPSProps[]>([]);

  const $npsList = computed(() => npsList.value);

  //pegar as avaliações NPS pendentes do usuário logado
  const getNpsPending = async () => {
    const { data } = await api.get<NPSProps[]>("/nps/pending");
    npsList.value = data;
  };

  //usuário logado criar um nps
  const createNps = async (npsData: NPSCreateProps) => {
    await api.post<NPSProps>("/nps", npsData);
  };

  return {
    $npsList,
    getNpsPending,
    createNps,
  };
});
