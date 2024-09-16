import type db from "@/db";
import userData from "./data/users.json";
import { users } from "../schema";

export default async function seed(db: db) {
  await db.insert(users).values(
    userData.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      profileId: user.profile_id,
      active: true,
    }))
  );
}
