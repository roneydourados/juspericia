import moment from "moment";
import { s3MinioClient } from "@/server/providers/S3";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { uuidv7 } from "uuidv7";
import { UserCreditSalt } from "~/types/UserCredit";

export const formatDate = (date: Date): string => {
  // remove T00:00:00.000Z evitando de formatar a data passando um dia amais ou a menos
  return date.toISOString().split("T")[0];
};

export const difDaysDelay = (initialDate: string, finalDate: string) => {
  const initDate = moment(initialDate);
  const endDate = moment(finalDate);

  const days = endDate.diff(initDate, "days");
  return days < 0 ? 0 : days;
};

export const saveFileFromMinion = async (input: {
  fileServerName: string;
  file: File;
}) => {
  const { file, fileServerName } = input;
  checkUploadsDirectory();

  const uploadPath = path.join(process.cwd(), "./uploads");

  try {
    const fileData = await file.arrayBuffer();

    if (fileData) {
      const filePath = `${uploadPath}/${fileServerName}`;

      fs.writeFile(filePath, Buffer.from(fileData), (error) => {
        if (error) {
          throw new Error(`Error creating file: ${error.message}`);
        }
      });

      // apagar do minion caso exista
      //await minioClient.removeObject("factory", fileServerName);
      removeMinionFile(fileServerName);

      // enviar para o minion
      await s3MinioClient.putObject(
        "juspericia",
        fileServerName!,
        Buffer.from(fileData)
      );

      // apagar arquivo local
      fs.unlinkSync(filePath);

      return fileServerName;
    }

    return null;
  } catch (error) {
    console.log("🚀 ~ saveFileFromMinion ~ error:", error);
    return null;
  }
};

export const removeMinionFile = async (fileServerName: string) => {
  await s3MinioClient.removeObject("juspericia", fileServerName);
};

export const getItemMinionFile = async (fileServerName: string) => {
  checkUploadsDirectory();
  return await s3MinioClient.getObject("juspericia", fileServerName);
};

// export const createUserCredit = async (payload: UserCreditSalt) => {
//   try {
//     await prisma.userCreditSalt.create({
//       data: {
//         userId: payload.userId!,
//         saleId: payload.saleId,
//         salt: Number(payload.salt!),
//         saltCategory: payload.saltCategory!,
//         expiredAt: new Date(payload.expiredAt!),
//         description: payload.description,
//         publicId: uuidv7(),
//         status: "active",
//         UserLogCredit: {
//           create: {
//             userId: payload.userId!,
//             history: `Inclusão de crédito referemte a ${
//               payload.description
//             } data de expiração ${moment(payload.expiredAt!).format(
//               "DD/MM/YYYY"
//             )}`,
//             oldValue: 0, // saldo anterior
//             inputValue: payload.salt!, // entrada
//             outputValue: 0, // saída
//             saltValue: payload.salt!, // saldo atual
//           },
//         },
//         UserCreditPayment: {
//           createMany: {
//             data: payload.UserCreditPayment!.map((payment) => ({
//               paymentForm: payment.paymentForm!,
//               value: payment.value!,
//               chargeId: payment.chargeId,
//               status: payment.status!,
//             })),
//           },
//         },
//       },
//     });
//   } catch (error) {
//     console.log("🚀 ~ setUserCredit ~ error:", error);

//     throw createError({
//       statusCode: 500,
//       message: "Error set user credit",
//     });
//   }
// };

const checkUploadsDirectory = () => {
  const uploadPath = path.join(process.cwd(), "./uploads");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }
};
