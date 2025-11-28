import { defineStore } from "pinia";

export const useSolicitationConsultationStore = defineStore(
  "solicitationConsultation",
  () => {
    const { api } = useAxios();

    const solicitationConsultation = ref<SolicitationConsultationProps>();
    const solicitationConsultations = ref<SolicitationConsultationList>();
    const solicitationReports = ref<SolicitationReportProps[]>([]);

    const $single = computed(() => solicitationConsultation.value);
    const $all = computed(() => solicitationConsultations.value);
    const $solicitationReports = computed(() => solicitationReports.value);

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
        medicIsNull,
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
          medicIsNull,
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

    const solicitationSetAntecipation = async (
      payload: SolicitationConsultationProps
    ) => {
      await api.put("/solicitation-consultation/antecipation", payload);
    };

    const solicitationCancelAntecipation = async (publicId: string) => {
      await api.put(
        `/solicitation-consultation/antecipation-cancel/${publicId}`
      );
    };

    const returnScheduled = async (id: string) => {
      await api.put(`/solicitation-consultation/return-scheduled/${id}`);
    };

    const createSolicitationCorrection = async (input: {
      patientConsultationId: number;
      correctionReason: string;
    }) => {
      await api.post("/solicitation-consultation/correction", input);
    };

    const deleteSolicitationCorrection = async (publicId: string) => {
      await api.delete(`/solicitation-consultation/correction/${publicId}`);
    };

    const closeSolicitationCorrection = async (publicId: string) => {
      await api.put(`/solicitation-consultation/correction/close/${publicId}`);
    };

    const indexSolicitationReports = async (input: {
      initialDate: string;
      finalDate: string;
      patientId?: number;
      userId?: number;
      status?: string;
      medicalSpecialtyId?: number;
    }) => {
      const {
        finalDate,
        initialDate,
        patientId,
        userId,
        status,
        medicalSpecialtyId,
      } = input;

      const { data } = await api.get<SolicitationReportProps[]>(
        "/solicitation-consultation-report",
        {
          params: {
            initialDate,
            finalDate,
            patientId,
            userId,
            status,
            medicalSpecialtyId,
          },
        }
      );

      solicitationReports.value = data;
    };

    const clearReport = () => {
      solicitationReports.value = [];
    };

    return {
      $single,
      $all,
      $solicitationReports,
      create,
      update,
      destroy,
      index,
      show,
      paidUseSalt,
      solicitationSetAntecipation,
      solicitationCancelAntecipation,
      returnScheduled,
      createSolicitationCorrection,
      deleteSolicitationCorrection,
      closeSolicitationCorrection,
      indexSolicitationReports,
      clearReport,
    };
  }
);
