import prisma from "~/lib/prisma";
import { ServicePackagesProps } from "~/types/ServicePackages";
import { uuidv7 } from "uuidv7";
import { UserProps } from "~/types/User";

export const getServicePackages = async () => {
  return prisma.servicePackage.findMany({
    where: {
      status: "active",
    },
  });
};

export const create = async (
  payload: ServicePackagesProps,
  user: UserProps
) => {
  try {
    const packageData = await prisma.servicePackage.create({
      data: {
        name: payload.name!,
        value: payload.value!,
        description: `Pacote de serviço foi criado pelo usuário: ${
          user.name
        }, com valor de ${payload.value?.toFixed(2)}`,
        urlImage: payload.urlImage!,
        publicId: uuidv7(),
      },
    });

    await prisma.servicePackageHistory.create({
      data: {
        publicId: uuidv7(),
        packageId: packageData.id,
        description: payload.description!,
        action: "create",
        userId: user.id!,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error create ServicePackage:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create ServicePackage",
    });
  }
};

export const update = async (
  payload: ServicePackagesProps,
  user: UserProps
) => {
  try {
    const exists = await prisma.servicePackage.findFirst({
      where: {
        publicId: payload.publicId!,
      },
    });

    if (!exists) {
      throw createError({
        statusCode: 404,
        message: "ServicePackage not found",
      });
    }

    const updatedPackage = await prisma.servicePackage.update({
      where: {
        id: exists.id,
      },
      data: {
        name: payload.name!,
        value: payload.value!,
        description: payload.description!,
        urlImage: payload.urlImage!,
      },
    });

    await prisma.servicePackageHistory.create({
      data: {
        publicId: uuidv7(),
        packageId: updatedPackage.id,
        description: `Pacote de serviço foi atualizado pelo usuário: ${
          user.name
        }, estava com valor de ${exists.value?.toFixed(
          2
        )} e foi alterado para ${payload.value?.toFixed(2)}`,
        action: "update",
        userId: user.id!,
      },
    });

    return updatedPackage;
  } catch (error) {
    console.log("🚀 ~ error update ServicePackage:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update ServicePackage",
    });
  }
};

export const destroy = async (publicId: string, user: UserProps) => {
  try {
    const exists = await prisma.servicePackage.findFirst({
      where: {
        publicId,
      },
    });

    if (!exists) {
      throw createError({
        statusCode: 404,
        message: "ServicePackage not found",
      });
    }

    await prisma.servicePackage.update({
      data: {
        status: "deleted",
      },
      where: {
        id: exists.id,
      },
    });

    await prisma.servicePackageHistory.create({
      data: {
        publicId: uuidv7(),
        packageId: exists.id,
        description: `Pacote de serviço foi deletado pelo usuário: ${user.name}`,
        action: "deleted",
        userId: user.id!,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error delete ServicePackage:", error);
    throw createError({
      statusCode: 500,
      message: "Error to delete ServicePackage",
    });
  }
};

export const getHistory = async (publicId: string) => {
  try {
    const exists = await prisma.servicePackage.findFirst({
      where: {
        publicId,
      },
    });

    if (exists) {
      return prisma.servicePackageHistory.findMany({
        where: {
          packageId: exists.id,
        },
      });
    }
  } catch (error) {
    console.log("🚀 ~ error get ServicePackagehistory:", error);
    throw createError({
      statusCode: 500,
      message: "Error to get ServicePackagehistory",
    });
  }
};
