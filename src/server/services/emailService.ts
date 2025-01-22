import { emailProvider } from "@/server/providers/email";
import hbs from "nodemailer-express-handlebars";
import path from "path";

export const sendEmail = async (
  email: string,
  name: string,
  office: string,
  token: string
) => {
  const config = useRuntimeConfig();

  try {
    //carregar dados do template para envio do email
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.join(process.cwd(), "./"),
        defaultLayout: "", // Change the value to an empty string or provide a specific layout name
      },
      viewPath: path.join(process.cwd(), "./"),
    };

    emailProvider.use("compile", hbs(handlebarOptions));

    const mailOptions = {
      from: '"Jusperícia" <atendimento@juspericia.com.br>', // sender address
      template: "email", // the name of the template file, i.e., email.handlebars
      to: email,
      subject: `Seja muito bem vindo, ${name}`,
      context: {
        name: name,
        company: office,
        linkConfirmation: `${config.public.appUrl}/activate-account/${token}`,
      },
    };

    await emailProvider.sendMail(mailOptions);
  } catch (error) {
    console.log(`Nodemailer error sending email to ${email}`, error);
    createError({
      message: "Erro ao enviar email de confirmação",
      status: 500,
    });
  }
};
