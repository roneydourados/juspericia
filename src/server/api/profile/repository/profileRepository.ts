import db from "@/db";

import { UserProfileProps } from "@/types/User";
import { appRoutes } from "@/server/utils/Constants";
import { profileRoutes, profiles } from "~/db/schema";

export const create = async ({ profileName, type }: UserProfileProps) => {
  try {
    const profile = await db
      .insert(profiles)
      .values({
        profileName: profileName!,
        type: type!,
      })
      .returning({ id: profiles.id });

    for (const route of appRoutes) {
      const exists = route.profiles.includes(type!);
      await db.insert(profileRoutes).values({
        profileId: profile[0].id,
        icon: route.icon,
        title: route.title,
        isMenu: route.isMenu,
        visible: exists ? true : false,
        to: route.to,
      });
    }
  } catch (error) {
    console.log("🚀 ~ create profile ~ error:", error);
    throw createError({
      statusCode: 400,
      message: "error create profile",
    });
  }
};
