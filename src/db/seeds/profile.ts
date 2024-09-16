import type db from "@/db";
import profilesData from "./data/profiles.json";
import { profiles } from "../schema";

export default async function seed(db: db) {
  await db.insert(profiles).values(
    profilesData.map((profile) => ({
      profileName: profile.profileName,
      type: profile.type as "ADMIN" | "ADVOGADO" | "MEDICO",
    }))
  );
}
