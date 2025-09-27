import { defineStore } from "pinia";

export const useAtendentMedicStore = defineStore("atendentMedic", () => {
  const { api } = useAxios();

  const atendentMedics = ref<AtendentMedicListProps>();

  const $all = computed(() => atendentMedics.value);

  const index = async (atendentId: number) => {
    const config = {
      params: {
        atendentId,
      },
    };

    const { data } = await api.get<AtendentMedicListProps>(
      "/atendent-medic",
      config
    );

    atendentMedics.value = data;
  };

  const setMedics = async (input: AtendentMedicProps[]) => {
    await api.post<AtendentMedicProps[]>("/atendent-medic", input);
  };

  const clearAssociations = async (atendentId: number) => {
    await api.delete(`/atendent-medic/${atendentId}`);
  };

  return {
    $all,
    index,
    setMedics,
    clearAssociations,
  };
});
