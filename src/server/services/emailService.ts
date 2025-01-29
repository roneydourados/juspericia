import { emailProvider } from "@/server/providers/email";
import hbs from "nodemailer-express-handlebars";
import path from "path";

interface SendEmailProps {
  email: string;
  name: string;
  office: string;
  template: string;
  linkConfirmation: string;
}

export const sendEmail = async ({
  email,
  name,
  office,
  template,
  linkConfirmation,
}: SendEmailProps) => {
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
      template, // the name of the template file, i.e., email.handlebars
      to: email,
      subject: "Jusperícia",
      context: {
        name: name,
        company: office,
        linkConfirmation,
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
