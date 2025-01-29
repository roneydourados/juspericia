import axios from "axios";
import {
  CustomerListProps,
  CustomerProps,
  CustomerResponseCreataedProps,
} from "./types/Customer";

export const useCustomerAsaas = () => {
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

  const createCustomer = async (
    customerData: CustomerProps
  ): Promise<CustomerResponseCreataedProps> => {
    try {
      const exists = await getCustomer(customerData.cpfCnpj!);

      if (exists.length > 0) {
        return exists[0];
      }

      const response = await asaasApi.post<CustomerResponseCreataedProps>(
        "/customers",
        customerData
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error);

        throw createError({
          statusCode: 500,
          message: error.response?.data.message || "Error to create client",
        });
      }

      console.log("Unexpected create customer asaas error:", error);

      throw createError({
        statusCode: 500,
        message: "Error to create",
      });
    }
  };

  const getCustomer = async (cpfCnpj: string) => {
    const options = {
      params: {
        cpfCnpj,
      },
    };

    try {
      const response = await asaasApi.get<CustomerListProps>(
        "/customers",
        options
      );

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error);

        throw createError({
          statusCode: 500,
          message: error.response?.data.message || "Error to get customer",
        });
      }

      console.log("Unexpected get customer asaas error:", error);

      throw createError({
        statusCode: 500,
        message: "Error to get customer",
      });
    }
  };

  return {
    createCustomer,
    getCustomer,
  };
};
