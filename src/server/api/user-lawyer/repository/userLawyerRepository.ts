import { UserProps } from "@/types/User";
import { and, ilike, or, eq, inArray, asc } from "drizzle-orm";
import { address, profileRoutes, profiles, users } from "~/db/schema";
import { db } from "@/db";
import { useHash } from "~/server/providers/hash";
import moment from "moment";

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
        name: String(payload.name!),
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
        active: true,
        crm: null,
        crmUf: null,
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
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
    },
    with: {
      Profile: {
        columns: {
          id: true,
          profileName: true,
          type: true,
        },
        with: {
          ProfileRoute: {
            where: eq(users.profileId, profileRoutes.profileId),
            columns: {
              profileId: true,
              icon: true,
              id: true,
              isMenu: true,
              title: true,
              to: true,
              visible: true,
            },
          },
        },
      },
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
            and(eq(profiles.id, users.profileId), eq(profiles.type, "ADVOGADO"))
          )
      )
    ),
    orderBy: [asc(users.name)],
  });

  const laywers = await Promise.all(
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

  return laywers;
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
