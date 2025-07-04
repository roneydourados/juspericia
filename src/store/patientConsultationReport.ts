import { FileProps } from "~/types/File";
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

    const create = async (payload: PatientConsultationReportProps) => {
      const { data } = await api.post<PatientConsultationReportProps>(
        "/patient-consultation-report",
        payload
      );

      patientConsultationReport.value = data;

      // // caso possua anexos então enviar
      // if (payload.attachments && payload.attachments?.length > 0 && data.id) {
      //   const formData = new FormData();

      //   payload.attachments.map((attachment) => {
      //     formData.append("file", attachment.fileData!);
      //     formData.append("fileCategory", attachment.fileCategory!);
      //     formData.append("fileName", attachment.fileName!);
      //     formData.append("ownerId", data.id?.toString()!);
      //   });

      //   await api.post("/files/upload-many", formData);
      // }
    };

    const show = async (publicId: string) => {
      const { data } = await api.get<PatientConsultationReportProps>(
        `/patient-consultation-report/${publicId}`
      );

      patientConsultationReport.value = data;
    };

    return {
      $single,
      $all,
      create,
      show,
      index,
    };
  }
);
