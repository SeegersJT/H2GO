import nodemailer, { Transporter } from "nodemailer";
import { CommunicationProvider } from "../Communication.provider";

export class DefaultEmailProvider implements CommunicationProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
  }

  async send(to: string, subject: string | undefined, body: string): Promise<void> {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await this.transporter.sendMail({
      from,
      to,
      subject,
      text: body,
      html: body,
    });
  }
}
