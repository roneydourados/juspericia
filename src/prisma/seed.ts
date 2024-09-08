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
    where: { email: "admin@juspericia.com" },
    update: {},
    create: {
      email: "admin@juspericia.com",
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
    where: { email: "advogado@juspericia.com" },
    update: {},
    create: {
      email: "advogado@juspericia.com",
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
    where: { email: "medico@juspericia.com" },
    update: {},
    create: {
      email: "medico@juspericia.com",
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

  //tipos de benefícios
  await prisma.benefitType.createMany({
    data: [
      {
        name: "Auxilio doença",
      },
      {
        name: "Auxilio acidente",
      },
      {
        name: "Aposentadoria",
      },
      {
        name: "BPC LOAS",
      },
      {
        name: "DPVAT",
      },
      {
        name: "Trabalhista",
      },
      {
        name: "Outros",
      },
    ],
  });

  //finalidade do laudo
  await prisma.reportPurpose.createMany({
    data: [
      {
        name: "Administrativo",
      },
      {
        name: "Judicial",
      },
      {
        name: "Outros",
      },
    ],
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
