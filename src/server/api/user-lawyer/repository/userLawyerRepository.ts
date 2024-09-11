import { UserProps } from "@/types/User";
import { and, ilike, or, eq } from "drizzle-orm";
import { address } from "~/db/schema/address";

import { profileRoutes } from "~/db/schema/profileRoutes";
import { profiles } from "~/db/schema/profiles";
import { users } from "~/db/schema/users";
import { db } from "~/server/providers/drizzle-postgres-service";
import { useHash } from "~/server/providers/hash";

export const create = async (payload: UserProps) => {
  const { hashText } = useHash();

  const profile = await db
    .select({
      id: profiles.id,
      type: profiles.type,
    })
    .from(profiles)
    .where(eq(profiles.type, "ADVOGADO"));

  if (!profile) {
    throw createError({
      statusCode: 500,
      message: "Profile not found",
    });
  }

  try {
    await validations(payload);

    const hashedpassword = await hashText(payload.password!);

    const user = await db
      .insert(users)
      .values({
        email: payload.email!,
        name: payload.name!,
        password: hashedpassword,
        cpfCnpj: payload.cpfCnpj ? String(payload.cpfCnpj) : null,
        phone: payload.phone ? String(payload.phone) : null,
        profileId: profile[0].id,
        oab: payload.oab ? String(payload.oab) : null,
        oabUf: payload.oabUf ? String(payload.oabUf) : null,
        officeName: payload.officeName ? String(payload.officeName) : null,
        officeCnpj: payload.officeCnpj ? String(payload.officeCnpj) : null,
        officeEmail: payload.officeEmail ? String(payload.officeEmail) : null,
        officePhone: payload.officePhone ? String(payload.officePhone) : null,
        updatedAt: new Date(), // Add the updatedAt property
        createdAt: new Date(), // Add the createdAt property
        active: true,
        crm: null,
        crmUf: null,
      })
      .returning({
        id: users.id,
        name: users.name,
        phone: users.phone,
        active: users.active,
        email: users.email,
        oab: users.oab,
        oabUf: users.oabUf,
        cpfCnpj: users.cpfCnpj,
        officeName: users.officeName,
        officePhone: users.officePhone,
        officeEmail: users.officeEmail,
        officeCnpj: users.officeCnpj,
      });

    if (payload.Address) {
      await db.insert(address).values({
        addressCity: payload.Address.addressCity,
        addressComplement: payload.Address.addressComplement,
        addressDistrict: payload.Address.addressDistrict,
        addressNumber: payload.Address.addressNumber,
        addressState: payload.Address.addressState,
        addressStreet: payload.Address.addressStreet,
        addressZipcode: payload.Address.addressZipcode,
        ownerId: user[0].id,
        addressCategory: addressCategoryType.user,
      });
    }

    return {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
    };
  } catch (error) {
    console.log("🚀 ~ error create User Lawyer:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create User Lawyer",
    });
  }
};

export const update = async (payload: UserProps) => {
  const { hashText } = useHash();

  await exists(payload.id!);

  const hashedpassword = payload.password
    ? await hashText(payload.password!)
    : undefined;

  try {
    const user = await db
      .update(users)
      .set({
        email: payload.email,
        name: payload.name,
        password: hashedpassword,
        active: payload.active,
        cpfCnpj: payload.cpfCnpj,
        phone: payload.phone,
        oab: payload.oab,
        oabUf: payload.oabUf,
        officeName: payload.officeName,
        officeCnpj: payload.officeCnpj,
        officeEmail: payload.officeEmail,
        officePhone: payload.officePhone,
      })
      .where(eq(users.id, payload.id!))
      .returning();

    if (payload.Address) {
      await db
        .delete(address)
        .where(
          and(
            eq(address.ownerId, user[0].id),
            eq(address.addressCategory, addressCategoryType.user)
          )
        );

      await db.insert(address).values({
        addressCity: payload.Address.addressCity,
        addressComplement: payload.Address.addressComplement,
        addressDistrict: payload.Address.addressDistrict,
        addressNumber: payload.Address.addressNumber,
        addressState: payload.Address.addressState,
        addressStreet: payload.Address.addressStreet,
        addressZipcode: payload.Address.addressZipcode,
        ownerId: user[0].id,
        addressCategory: addressCategoryType.user,
      });
    }

    return {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
    };
  } catch (error) {
    console.log("🚀 ~ error update User Lawyer:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update User Lawyer",
    });
  }
};

export const destroy = async (id: number) => {
  await exists(id);

  try {
    await db.delete(users).where(eq(users.id, id));

    await db
      .delete(address)
      .where(
        and(
          eq(address.ownerId, id),
          eq(address.addressCategory, addressCategoryType.user)
        )
      );
  } catch (error) {
    console.log("🚀 ~ error remove User Lawyer:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove User Lawyer",
    });
  }
};

export const index = async (inputQuery: string) => {
  const data = await db
    .select({
      id: users.id,
      name: users.name,
      phone: users.phone,
      active: users.active,
      email: users.email,
      oab: users.oab,
      oabUf: users.oabUf,
      cpfCnpj: users.cpfCnpj,
      officeName: users.officeName,
      officePhone: users.officePhone,
      officeEmail: users.officeEmail,
      officeCnpj: users.officeCnpj,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.id, users.profileId))
    .where(
      or(
        ilike(users.email, inputQuery),
        ilike(users.name, inputQuery),
        and(eq(profiles.type, "ADVOGADO"))
      )
    );

  const laywers = await Promise.all(
    data.map(async (item) => {
      const Address = await db
        .select()
        .from(address)
        .where(
          and(
            eq(address.ownerId, item.id),
            eq(address.addressCategory, addressCategoryType.user)
          )
        );

      return {
        ...item,
        Address,
      };
    })
  );

  return laywers;
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const user = await db
    .select({
      id: users.id,
      profileId: users.profileId,
      name: users.name,
      phone: users.phone,
      active: users.active,
      email: users.email,
      oab: users.oab,
      oabUf: users.oabUf,
      cpfCnpj: users.cpfCnpj,
      officeName: users.officeName,
      officePhone: users.officePhone,
      officeEmail: users.officeEmail,
      officeCnpj: users.officeCnpj,
      Profile: profiles,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.id, users.profileId))
    .where(eq(users.id, id));

  if (!user[0]) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  const ProfileRoutes = await db
    .select()
    .from(profileRoutes)
    .where(eq(profileRoutes.profileId, user[0].profileId));

  const Address = await db
    .select()
    .from(address)
    .where(
      and(
        eq(address.ownerId, user[0].id),
        eq(address.addressCategory, addressCategoryType.user)
      )
    );

  return {
    ...user[0],
    ProfileRoutes,
    Address,
  };
};

const validations = async (payload: UserProps) => {
  const exists = await db
    .select()
    .from(users)
    .where(eq(users.email, String(payload.email!)));

  if (exists[0]) {
    throw createError({
      statusCode: 409,
      message: "User Lawyer already exists",
    });
  }

  if (!payload.email) {
    throw createError({
      statusCode: 409,
      message: "User Lawyer email is required",
    });
  }

  if (!payload.name) {
    throw createError({
      statusCode: 409,
      message: "User Lawyer name is required",
    });
  }
};
