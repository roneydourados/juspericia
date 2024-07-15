import { PrismaClient } from "@prisma/client";
import { appRoutes } from "../server/utils/Constants";
import { useHash } from "../server/providers/hash";

const prisma = new PrismaClient();

async function main() {
  const { hashText } = useHash();

  const password = await hashText("admin@#$2024");
  const passwordAdvogado = await hashText("advogado@#$2024");
  const passwordMedico = await hashText("medico@#$2024");

  // admin
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Admin",
      password,
      Profile: {
        create: {
          profileName: "Administrador", // Add a profileName property
          type: "ADMIN", // Add a type property
          ProfileRoute: {
            createMany: {
              data: appRoutes
                .sort((a, b) => a.order - b.order)
                .map((route) => {
                  const exists = route.profiles.includes("ADMIN");
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
      },
    },
  });

  // advogado
  await prisma.user.upsert({
    where: { email: "advogado@advogado.com" },
    update: {},
    create: {
      email: "advogado@advogado.com",
      name: "Advogado",
      password: passwordAdvogado,
      Profile: {
        create: {
          profileName: "Advogado", // Add a profileName property
          type: "ADVOGADO", // Add a type property
          ProfileRoute: {
            createMany: {
              data: appRoutes
                .sort((a, b) => a.order - b.order)
                .map((route) => {
                  const exists = route.profiles.includes("ADVOGADO");
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
      },
    },
  });

  // medico
  await prisma.user.upsert({
    where: { email: "medico@medico.com" },
    update: {},
    create: {
      email: "medico@medico.com",
      name: "Médico",
      password: passwordMedico,
      Profile: {
        create: {
          profileName: "Médico", // Add a profileName property
          type: "MEDICO", // Add a type property
          ProfileRoute: {
            createMany: {
              data: appRoutes
                .sort((a, b) => a.order - b.order)
                .map((route) => {
                  const exists = route.profiles.includes("MEDICO");
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
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
