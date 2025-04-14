import prisma from "@/lib/prisma";
import { SystemParametersProps } from "@/types/SystemParameters";

export const index = async () => {
  try {
    return await prisma.systemParameters.findFirst();
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Error get system parameters",
    });
  }
};

export const update = async (payload: SystemParametersProps) => {
  try {
    const parameters = await prisma.systemParameters.findFirst({
      where: {
        publicId: payload.publicId!,
      },
    });

    if (!parameters) {
      throw createError({
        statusCode: 404,
        message: "System parameters not found",
      });
    }

    const data = await prisma.systemParameters.update({
      data: payload,
      where: {
        id: parameters.id,
      },
    });

    return data;
  } catch (error) {
    console.log("🚀 ~ update system parameters ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Error update system parameters",
    });
  }
};
