import type db from "@/db";
import addressData from "./data/address.json";
import { address } from "../schema";

export default async function seed(db: db) {
  await db.insert(address).values(
    addressData.map((a) => ({
      id: a.id,
      ownerId: a.owner_id,
      addressCategory: a.addressCategory,
      addressZipcode: a.addressZipcode,
      addressCity: a.addressCity,
      addressDistrict: a.addressDistrict,
      addressStreet: a.addressStreet,
      addressNumber: a.addressNumber,
      addressState: a.addressState,
      addressComplement: a.addressComplement,
    }))
  );
}
