import { defineStore } from "pinia";

export const useBenefitTypeStore = defineStore("benefitType", () => {
  const { api } = useAxios();

  const benefitType = ref<BenefitTypeProps>();
  const benefitTypes = ref<BenefitTypeProps[]>([]);
  const $single = computed(() => benefitType.value);
  const $all = computed(() => benefitTypes.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        inputQuery,
      },
    };

    const { data } = await api.get<BenefitTypeProps[]>("/benefit-type", config);

    benefitTypes.value = data;
  };

  const show = async (id: string) => {
    const { data } = await api.get<BenefitTypeProps>(`/benefit-type/${id}`);

    benefitType.value = data;
  };

  const create = async (input: BenefitTypeProps) => {
    const { data } = await api.post<BenefitTypeProps>("/benefit-type", input);

    benefitType.value = data;
  };

  const update = async (input: BenefitTypeProps) => {
    const { data } = await api.put<BenefitTypeProps>("/benefit-type", input);

    benefitType.value = data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/benefit-type/${id}`);
  };

  return { $single, $all, index, create, update, destroy, show };
});
