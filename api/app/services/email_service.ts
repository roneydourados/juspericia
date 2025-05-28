import env from '#start/env'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'node:path'

interface SendEmailProps {
  email: string
  name: string
  office: string
  template: string
  linkConfirmation: string
}

export default class EmailService {
  private readonly mailPass = env.get('MAIL_PASS', '')
  private readonly mailUser = env.get('MAIL_USER', '')
  private readonly mailHost = env.get('MAIL_HOST', '')
  private readonly mailPort = env.get('MAIL_PORT', '0')

  private mail = nodemailer.createTransport({
    host: this.mailHost,
    port: Number(this.mailPort),
    secure: Number(this.mailPort) === 465, // Us/e `true` for port 465, `false` for all other ports
    // tls: {
    //   maxVersion: "TLSv1.3",
    //   minVersion: "TLSv1.2",
    //   ciphers: "TLS_AES_128_GCM_SHA256",
    // },
    tls: {
      ciphers: 'SSLv3',
    },

    auth: {
      user: this.mailUser,
      pass: this.mailPass,
    },
  })

  async sendMail({ email, name, office, template, linkConfirmation }: SendEmailProps) {
    try {
      //carregar dados do template para envio do email
      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.join(process.cwd(), './'),
          defaultLayout: '', // Change the value to an empty string or provide a specific layout name
        },
        viewPath: path.join(process.cwd(), './'),
      }

      this.mail.use('compile', hbs(handlebarOptions))

      const mailOptions = {
        from: `"Jusperícia" <${this.mailUser}>`, // sender address
        template, // the name of the template file, i.e., email.handlebars
        to: email,
        subject: 'Jusperícia',
        context: {
          name: name,
          company: office,
          linkConfirmation,
        },
      }

      await this.mail.sendMail(mailOptions)
    } catch (error) {
      console.log(`Nodemailer error sending email to ${email}`, error)
      throw new Error(`Failed to send email to ${email}: ${error.message}`)
    }
  }
}
