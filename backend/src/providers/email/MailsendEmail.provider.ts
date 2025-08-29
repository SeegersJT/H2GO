import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { CommunicationProvider } from "../Communication.provider";
import { HttpError } from "../../utils/HttpError";
import { StatusCode } from "../../utils/constants/StatusCode.constant";

export class MailsendEmailProvider implements CommunicationProvider {
  private mailerSend: MailerSend;
  private from: Sender;

  constructor() {
    const apiKey = process.env.MAILSEND_API_KEY;
    const fromEmail = process.env.MAILSEND_FROM_EMAIL;
    const fromName = process.env.MAILSEND_FROM_NAME || "";

    if (!apiKey) {
      throw new Error("MAILSEND_API_KEY is not configured");
    }

    if (!fromEmail) {
      throw new Error("MAILSEND_FROM_EMAIL is not configured");
    }

    this.mailerSend = new MailerSend({ apiKey });
    this.from = new Sender(fromEmail, fromName);
  }

  async send(to: string, subject: string | undefined, body: string): Promise<void> {
    const recipients = [new Recipient(to, to)];

    const emailParams = new EmailParams()
      .setFrom(this.from)
      .setTo(recipients)
      .setSubject(subject ?? "")
      .setHtml(body)
      .setText(body);

    try {
      await this.mailerSend.email.send(emailParams);
    } catch (error: any) {
      const message = error?.body?.message || error?.message || "Unknown error from Mailsend";
      const code = error?.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
      throw new HttpError(`Mailsend API error: ${message}`, code);
    }
  }
}
