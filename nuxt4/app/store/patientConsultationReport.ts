import { defineStore } from "pinia";

export const usePatientConsultationReportStore = defineStore(
  "patientConsultationReport",
  () => {
    const { api } = useAxios();

    const patientConsultationReport = ref<PatientConsultationReportProps>();
    const patientConsultationReports = ref<
      PatientConsultationReportListProps[]
    >([]);
    const solicitationReports = ref<SolicitationReportProps[]>([]);

    const $single = computed(() => patientConsultationReport.value);
    const $all = computed(() => patientConsultationReports.value);
    const $solicitationReports = computed(() => solicitationReports.value);

    const index = async (input: {
      initialDate: string;
      finalDate: string;
      patientId?: number;
      userId?: number;
      emitReport?: boolean;
      justify?: boolean;
    }) => {
      const { finalDate, initialDate, patientId, userId, emitReport, justify } =
        input;

      const { data } = await api.get<PatientConsultationReportListProps[]>(
        "/patient-consultation-report",
        {
          params: {
            initialDate,
            finalDate,
            patientId,
            userId,
            emitReport,
            justify,
          },
        }
      );

      patientConsultationReports.value = data;
    };

    const update = async (payload: PatientConsultationReportProps) => {
      const { data } = await api.put<PatientConsultationReportProps>(
        "/patient-consultation-report",
        payload
      );

      patientConsultationReport.value = data;
    };

    const create = async (payload: PatientConsultationReportProps) => {
      const { data } = await api.post<PatientConsultationReportProps>(
        "/patient-consultation-report",
        payload
      );

      patientConsultationReport.value = data;
    };

    const show = async (publicId: string) => {
      const { data } = await api.get<PatientConsultationReportProps>(
        `/patient-consultation-report/${publicId}`
      );

      patientConsultationReport.value = data;
    };

    const cancelSign = async (input: { publicId: string; justify: string }) => {
      const { publicId, justify } = input;

      const payload = {
        publicId,
        justify,
      };
      await api.put("/patient-consultation-report/cancel-sign", payload);
    };

    const addJustify = async (inut: { justify: string; publicId: string }) => {
      const { justify, publicId } = inut;
      const payload = {
        justify,
        publicId,
      };

      await api.post("/patient-consultation-report/justify", payload);
    };

    const getPdfBase64 = async (publicId: string) => {
      const { data } = await api.get<{ pdfBase64: string }>(
        `/patient-consultation-report/${publicId}/pdf-base64`
      );

      return data;
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

    return {
      $single,
      $all,
      $solicitationReports,
      create,
      show,
      index,
      cancelSign,
      addJustify,
      update,
      getPdfBase64,
      indexSolicitationReports,
    };
  }
);
