import { UserProps } from "@/types/User";
import { useHash } from "~/server/providers/hash";
import { db } from "@/db";
import { eq, and, or, ilike, inArray, asc } from "drizzle-orm";
import { users, profiles } from "@/db/schema";
import moment from "moment";

export const create = async (payload: UserProps) => {
  const { hashText } = useHash();

  const profile = await db
    .select({
      id: profiles.id,
      type: profiles.type,
    })
    .from(profiles)
    .where(eq(profiles.type, "ADMIN"));

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
        cpfCnpj: payload.cpfCnpj,
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

    return user;
  } catch (error) {
    console.log("🚀 ~ error create User Admin:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create User Admin",
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
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    return user;
  } catch (error) {
    console.log("🚀 ~ error update User Admin:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update User Admin",
    });
  }
};

export const destroy = async (id: number) => {
  await exists(id);

  try {
    await db.delete(users).where(eq(users.id, id));
  } catch (error) {
    console.log("🚀 ~ error remove User Admin:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove User Admin",
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
            and(eq(profiles.id, users.profileId), eq(profiles.type, "ADMIN"))
          )
      )
    ),
    orderBy: [asc(users.name)],
  });

  return user;
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

  return user;
};

const validations = async (payload: UserProps) => {
  const exists = await db.query.users.findFirst({
    where: eq(users.email, payload.email!),
  });

  if (exists) {
    throw createError({
      statusCode: 409,
      message: "User Admin already exists",
    });
  }

  if (!payload.email) {
    throw createError({
      statusCode: 409,
      message: "User Admin email is required",
    });
  }

  if (!payload.name) {
    throw createError({
      statusCode: 409,
      message: "User Admin name is required",
    });
  }
};
