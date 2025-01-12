import prisma from "@/lib/prisma";
import { useCustomerAsaas } from "~/lib/asaas/customer-api";
import { CustomerProps } from "~/lib/asaas/types/Customer";
import { UserProps } from "~/types/User";

export const createCustomer = async (
  customer: CustomerProps,
  user: UserProps
) => {
  const { createCustomer, getCustomer } = useCustomerAsaas();

  // antes de cadastrar o cliente, verificar se ele ja foi cadastrado
  const exists = await getCustomer(customer.cpfCnpj!);

  // se ele ja foi cadastrado, retornar o mesmo usuário que esta sendo passado, pois o mesmo já possui o id do asaas
  if (exists.length > 0) {
    return customer;
  }

  // se ele nao foi cadastrado, cadastrar
  const response = await createCustomer(customer);

  if (response) {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        customerId: response.id,
      },
    });

    return updatedUser;
  }

  return {};
};

export const getCustomer = async (cpfCnpj: string) => {
  const { getCustomer } = useCustomerAsaas();

  return getCustomer(cpfCnpj);
};
