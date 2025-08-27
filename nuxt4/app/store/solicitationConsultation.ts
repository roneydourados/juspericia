import { defineStore } from "pinia";

export const useSolicitationConsultationStore = defineStore(
  "solicitationConsultation",
  () => {
    const { api } = useAxios();

    const solicitationConsultation = ref<SolicitationConsultationProps>();
    const solicitationConsultations = ref<SolicitationConsultationList>();
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

    const destroy = async (id: string) => {
      await api.delete(`/solicitation-consultation/${id}`);
    };

    const show = async (id: string) => {
      const { data } = await api.get<SolicitationConsultationProps>(
        `/solicitation-consultation/${id}`
      );

      solicitationConsultation.value = data;
    };

    const index = async (filters: SolicitationConsultationFilterProps) => {
      const {
        initialDateSolicitation,
        finalDateSolicitation,
        status,
        benefitTypeId,
        patientId,
        reportPurposeId,
        userId,
      } = filters;
      const config = {
        params: {
          initialDateSolicitation,
          finalDateSolicitation,
          status,
          benefitTypeId,
          patientId,
          reportPurposeId,
          userId,
        },
      };

      const { data } = await api.get<SolicitationConsultationList>(
        "/solicitation-consultation",
        config
      );

      solicitationConsultations.value = data;
    };

    const paidUseSalt = async (publicId: string) => {
      await api.post<SolicitationConsultationProps>(
        `/solicitation-consultation/paid-credit/${publicId}`
      );
    };

    return {
      $single,
      $all,
      create,
      update,
      destroy,
      index,
      show,
      paidUseSalt,
    };
  }
);
