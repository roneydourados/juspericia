import { ConsultationProps } from "@/types/Consultation";
import { defineStore } from "pinia";

export const useConsultationStore = defineStore("consultation", () => {
  const { api } = useAxios();

  const consultation = ref<ConsultationProps>();
  const consultations = ref<ConsultationProps[]>([]);
  const $single = computed(() => consultation.value);
  const $all = computed(() => consultations.value);

  const create = async (payload: ConsultationProps) => {
    const { data } = await api.post<ConsultationProps>(
      "/consultation",
      payload
    );
    consultation.value = data;
  };

  const update = async (payload: ConsultationProps) => {
    const { data } = await api.put<ConsultationProps>("/consultation", payload);
    consultation.value = data;
  };

  const destroy = async (id: number) => {
    await api.delete(`/consultation/${id}`);
  };

  const show = async (id: number) => {
    const { data } = await api.get<ConsultationProps>(`/consultation/${id}`);

    consultation.value = data;
  };

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        inputQuery,
      },
    };

    const { data } = await api.get<ConsultationProps[]>(
      "/consultation",
      config
    );

    consultations.value = data;
  };

  return {
    consultation,
    consultations,
    $single,
    $all,
    create,
    update,
    destroy,
    index,
    show,
  };
});
