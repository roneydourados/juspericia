import { defineStore } from "pinia";

export const useServicePackageStore = defineStore("servicePackage", () => {
  const { api } = useAxios();
  const servicePackages = ref<ServicePackagesProps[]>([]);
  const packageHistory = ref<ServicePackagesHistoryProps[]>([]);
  const servicePackage = ref<ServicePackagesProps>();

  const $all = computed(() => servicePackages.value);
  const $single = computed(() => servicePackage.value);
  const $history = computed(() => packageHistory.value);

  const index = async () => {
    const { data } = await api.get<ServicePackagesProps[]>("/service-package");

    servicePackages.value = data;
  };

  const create = async (payload: ServicePackagesProps) => {
    const { data } = await api.post<ServicePackagesProps>(
      "/service-package",
      payload
    );
    servicePackage.value = data;
  };

  const update = async (payload: ServicePackagesProps) => {
    const { data } = await api.put<ServicePackagesProps>(
      "/service-package",
      payload
    );
    servicePackage.value = data;
  };

  const destroy = async (publicId: string) => {
    await api.delete(`/service-package/${publicId}`);
  };

  const getHistory = async (publicId: string) => {
    const { data } = await api.get<ServicePackagesHistoryProps[]>(
      `/service-package/history/${publicId}`
    );

    packageHistory.value = data;
  };

  return {
    index,
    create,
    update,
    destroy,
    getHistory,
    $all,
    $single,
    $history,
  };
});
