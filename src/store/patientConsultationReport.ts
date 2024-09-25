import { defineStore } from "pinia";

export const usePatientConsultationReportStore = defineStore(
  "patientConsultationReport",
  () => {
    const { api } = useAxios();

    const patientConsultationReport = ref<PatientConsultationReportProps>();
    const patientConsultationReports = ref<PatientConsultationReportProps[]>(
      []
    );
    const $single = computed(() => patientConsultationReport.value);
    const $all = computed(() => patientConsultationReports.value);

    const index = async (input: {
      initialDate: string;
      finalDate: string;
      /*userId?: number;*/
    }) => {
      const { finalDate, initialDate } = input;
      const { data } = await api.get<PatientConsultationReportProps[]>(
        "/patient-consultation-report",
        {
          params: {
            initialDate,
            finalDate,
          },
        }
      );

      patientConsultationReports.value = data;
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

    return { $single, $all, create, show, index };
  }
);
