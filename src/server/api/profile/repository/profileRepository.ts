import prisma from "@/lib/prisma";
import { UserProfileProps } from "@/types/User";
import { appRoutes } from "@/server/utils/Constants";

export const create = async ({ profileName, type }: UserProfileProps) => {
  try {
    return await prisma.profile.create({
      data: {
        profileName: profileName!,
        type: type!,
        ProfileRoute: {
          createMany: {
            data: appRoutes.map((route) => {
              const exists = route.profiles.includes(type!);
              return {
                icon: route.icon,
                title: route.title,
                isMenu: route.isMenu,
                visible: exists ? true : false,
                to: route.to,
              };
            }),
          },
        },
      },
    });
  } catch (error) {
    console.log("🚀 ~ create profile ~ error:", error);
    throw createError({
      statusCode: 400,
      message: "error create profile",
    });
  }
};
