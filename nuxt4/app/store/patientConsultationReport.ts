//import { FileProps } from "@/app/types/File";
import { defineStore } from "pinia";

export const usePatientConsultationReportStore = defineStore(
  "patientConsultationReport",
  () => {
    const { api } = useAxios();

    const patientConsultationReport = ref<PatientConsultationReportProps>();
    const patientConsultationReports = ref<
      PatientConsultationReportListProps[]
    >([]);

    const $single = computed(() => patientConsultationReport.value);
    const $all = computed(() => patientConsultationReports.value);

    const index = async (input: {
      initialDate: string;
      finalDate: string;
      patientId?: number;
      medicId?: number;
      emitReport?: boolean;
    }) => {
      const { finalDate, initialDate, patientId, medicId, emitReport } = input;
      const { data } = await api.get<PatientConsultationReportListProps[]>(
        "/patient-consultation-report",
        {
          params: {
            initialDate,
            finalDate,
            patientId,
            medicId,
            emitReport,
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

    return {
      $single,
      $all,
      create,
      show,
      index,
      cancelSign,
      addJustify,
      update,
    };
  }
);
