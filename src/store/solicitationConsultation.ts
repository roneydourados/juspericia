import { defineStore } from "pinia";

export const useSolicitationConsultationStore = defineStore(
  "solicitationConsultation",
  () => {
    const { api } = useAxios();

    const solicitationConsultation = ref<SolicitationConsultationProps>();
    const solicitationConsultations = ref<SolicitationConsultationProps[]>([]);
    const $single = computed(() => solicitationConsultation.value);
    const $all = computed(() => solicitationConsultations.value);

    const create = async (payload: SolicitationConsultationProps) => {
      const { data } = await api.post<SolicitationConsultationProps>(
        "/solicitation-consultation",
        payload
      );
      solicitationConsultation.value = data;
    };

    const update = async (payload: SolicitationConsultationProps) => {
      const { data } = await api.put<SolicitationConsultationProps>(
        "/solicitation-consultation",
        payload
      );
      solicitationConsultation.value = data;
    };

    const destroy = async (id: number) => {
      await api.delete(`/solicitation-consultation/${id}`);
    };

    const show = async (id: number) => {
      const { data } = await api.get<SolicitationConsultationProps>(
        `/solicitation-consultation/${id}`
      );

      solicitationConsultation.value = data;
    };

    const index = async (inputQuery: string) => {
      const config = {
        params: {
          inputQuery,
        },
      };

      const { data } = await api.get<SolicitationConsultationProps[]>(
        "/solicitation-consultation",
        config
      );

      solicitationConsultations.value = data;
    };

    return {
      $single,
      $all,
      create,
      update,
      destroy,
      index,
      show,
    };
  }
);