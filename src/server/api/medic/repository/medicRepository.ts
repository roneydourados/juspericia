import { UserProps } from "@/types/User";
import { useHash } from "~/server/providers/hash";
import { db } from "@/db";
import { eq, and, or, ilike, inArray, asc } from "drizzle-orm";
import { users, profiles, address } from "@/db/schema";
import moment from "moment";

export const create = async (payload: UserProps) => {
  const { hashText } = useHash();

  const profile = await db
    .select({
      id: profiles.id,
      type: profiles.type,
    })
    .from(profiles)
    .where(eq(profiles.type, "MEDICO"));

  if (!profile[0]) {
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
        active: true,
        crm: payload.crm,
        cpfCnpj: payload.cpfCnpj,
        crmUf: payload.crmUf,
        phone: payload.phone,
        profileId: profile[0].id,
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
      .returning({
        id: users.id,
        name: users.name,
        phone: users.phone,
        active: users.active,
        email: users.email,
      });

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

    return user;
  } catch (error) {
    console.log("🚀 ~ error create Medic:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create medic",
    });
  }
};

export const update = async (payload: UserProps) => {
  const { hashText } = useHash();

  await exists(payload.id!);
  //await validations(payload);

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
        active: true,
        crm: payload.crm,
        cpfCnpj: payload.cpfCnpj,
        crmUf: payload.crmUf,
        phone: payload.phone,
      })
      .where(eq(users.id, payload.id!))
      .returning({
        id: users.id,
        name: users.name,
        phone: users.phone,
        active: users.active,
        email: users.email,
      });

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

    return user;
  } catch (error) {
    console.log("🚀 ~ error update Medic:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update Medic",
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
  const user = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      phone: true,
      active: true,
      email: true,
      oab: true,
      oabUf: true,
      cpfCnpj: true,
      officeName: true,
      officePhone: true,
      officeEmail: true,
      officeCnpj: true,
      crm: true,
      crmUf: true,
    },
    where: and(
      or(
        ilike(users.email, `%${inputQuery}%`),
        ilike(users.name, `%${inputQuery}%`)
      ),
      inArray(
        users.profileId,
        db
          .select({ profileId: profiles.id })
          .from(profiles)
          .where(
            and(eq(profiles.id, users.profileId), eq(profiles.type, "MEDICO"))
          )
      )
    ),
    orderBy: [asc(users.name)],
  });

  const medics = await Promise.all(
    user.map(async (item) => {
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
        Address: Address[0],
      };
    })
  );

  return medics;
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const user = await db.query.users.findFirst({
    columns: {
      id: true,
      profileId: true,
      name: true,
      phone: true,
      active: true,
      email: true,
      oab: true,
      oabUf: true,
      cpfCnpj: true,
      officeName: true,
      officePhone: true,
      officeEmail: true,
      officeCnpj: true,
      crm: true,
      crmUf: true,
    },
    with: {
      Profile: {
        columns: {
          profileName: true,
          type: true,
        },
        with: {
          ProfileRoute: true,
        },
      },
    },
    where: (users, { eq }) => eq(users.id, id),
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  const Address = await db
    .select()
    .from(address)
    .where(
      and(
        eq(address.ownerId, user.id),
        eq(address.addressCategory, addressCategoryType.user)
      )
    );

  return {
    ...user,
    Address: Address[0],
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
      message: "User Medic already exists",
    });
  }

  if (!payload.email) {
    throw createError({
      statusCode: 409,
      message: "User Medic email is required",
    });
  }

  if (!payload.name) {
    throw createError({
      statusCode: 409,
      message: "User Medic name is required",
    });
  }
};
