import axios from "axios";

import { PaymentAsaasProps } from "./types/Payment";
import { PaymentAsaasResponseProps } from "./types/PaymentResponse";

export const useAsaasPayment = () => {
  const apiKey =
    (useRuntimeConfig().public.asaasApikey as string) ||
    "https://sandbox.asaas.com/api/v3";

  const baseUrl = (useRuntimeConfig().public.asaasBaseUrl as string) || "";

  const asaasApi = axios.create({
    baseURL: baseUrl,
    headers: {
      accept: "application/json",
      access_token: apiKey,
    },
  });

  const createPayment = async (payload: PaymentAsaasProps) => {
    try {
      payload.billingType = "UNDEFINED"; // deixar o cliente escoher o tipo de cobrança na tela do asaas
      payload.dueDate = formatDate(new Date(payload.dueDate));

      // criar cobrança
      const { data } = await asaasApi.post("/payments", payload);

      return data;
    } catch (error) {
      console.log("🚀 ~ createPayment ~ error:", error);

      throw createError({
        statusCode: 500,
        message: "Erro on create payment!",
      });
    }
  };

  return {
    createPayment,
  };
};
