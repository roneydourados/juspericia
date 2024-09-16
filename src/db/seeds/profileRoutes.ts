import type db from "@/db";
import profileRoutesData from "./data/profileRoutes.json";
import { profileRoutes } from "../schema";

export default async function seed(db: db) {
  await db.insert(profileRoutes).values(
    profileRoutesData.map((profileRoute) => ({
      profileId: profileRoute.profileId,
      icon: profileRoute.icon,
      title: profileRoute.title,
      isMenu: profileRoute.isMenu,
      visible: profileRoute.visible,
      to: profileRoute.to,
    }))
  );
}
