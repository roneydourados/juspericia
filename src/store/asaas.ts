import { CustomerProps } from "@/lib/asaas/types/Customer";
import { PaymentAsaasProps } from "@/lib/asaas/types/Payment";
import { defineStore } from "pinia";

export const useAsaasStore = defineStore("asaas", () => {
  const { api } = useAxios();
  const paymentReponse = ref();

  const $paymentReponse = computed(() => paymentReponse.value);

  const createCustomer = async (payload: CustomerProps) => {
    await api.post("/asaas/customer", payload);
  };

  const createPayment = async (payload: PaymentAsaasProps) => {
    paymentReponse.value = await api.post("/asaas/payment", payload);
  };

  const deletePayment = async (id: string) => {
    await api.delete(`/asaas/payment/${id}`);
  };

  return { createCustomer, createPayment, deletePayment, $paymentReponse };
});
