import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { HttpError } from "../../utils/HttpError";
import { StatusCode } from "../../utils/constants/StatusCode.constant";
import { CommunicationProvider } from "../Communication.provider";

export class MailersendEmailProvider implements CommunicationProvider {
  private mailerSend: MailerSend;
  private from: Sender;

  constructor() {
    const apiKey = process.env.MAILERSEND_API_KEY;
    const fromEmail = process.env.MAILERSEND_FROM_EMAIL;
    const fromName = process.env.MAILERSEND_FROM_NAME || "";

    if (!apiKey) {
      throw new HttpError("MAILERSEND_API_KEY is not configured", StatusCode.INTERNAL_SERVER_ERROR);
    }

    if (!fromEmail) {
      throw new HttpError("MAILERSEND_FROM_EMAIL is not configured", StatusCode.INTERNAL_SERVER_ERROR);
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
      const message = error?.body?.message || error?.message || "Unknown error from MAILERSEND";
      const code = error?.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
      throw new HttpError(`MAILERSEND API error: ${message}`, code);
    }
  }
}
