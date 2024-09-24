import { defineStore } from "pinia";

export const usePatientConsultationReportStore = defineStore(
  "patientConsultationReport",
  () => {
    const { api } = useAxios();

    const patientConsultationReport = ref<PatientConsultationReportProps>();
    const $single = computed(() => patientConsultationReport.value);

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

    return { $single, create, show };
  }
);
