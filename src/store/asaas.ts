import { CustomerProps } from "@/lib/asaas/types/Customer";
import { defineStore } from "pinia";

export const useAsaasStore = defineStore("asaas", () => {
  const { api } = useAxios();

  const createCustomer = async (payload: CustomerProps) => {
    await api.post("/asaas/customer", payload);
  };

  return { createCustomer };
});
