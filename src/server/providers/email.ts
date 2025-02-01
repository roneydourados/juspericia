import nodemailer from "nodemailer";

const config = useRuntimeConfig();

export const emailProvider = nodemailer.createTransport({
  host: config.emailProvider.host,
  port: Number(config.emailProvider.port),
  secure: Number(config.emailProvider.port) === 465, // Us/e `true` for port 465, `false` for all other ports

  // tls: {
  //   maxVersion: "TLSv1.3",
  //   minVersion: "TLSv1.2",
  //   ciphers: "TLS_AES_128_GCM_SHA256",
  // },
  tls: {
    ciphers: "SSLv3",
  },

  auth: {
    user: config.emailProvider.user,
    pass: config.emailProvider.pass,
  },
});
