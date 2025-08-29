import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { CommunicationProvider } from "../Communication.provider";

export class MailsendEmailProvider implements CommunicationProvider {
  private mailerSend: MailerSend;
  private from: Sender;

  constructor() {
    const apiKey = process.env.MAILSEND_API_KEY;
    const fromEmail = process.env.MAILSEND_FROM_EMAIL;
    const fromName = process.env.MAILSEND_FROM_NAME || "";

    console.log("=============================================================");
    console.log("apiKey", apiKey);
    console.log("fromEmail", fromEmail);
    console.log("fromName", fromName);
    console.log("=============================================================");

    if (!apiKey) {
      throw new Error("MAILSEND_API_KEY is not configured");
    }

    if (!fromEmail) {
      throw new Error("MAILSEND_FROM_EMAIL is not configured");
    }

    this.mailerSend = new MailerSend({ apiKey });

    console.log("mailerSend", this.mailerSend);

    this.from = new Sender(fromEmail, fromName);

    console.log("from", this.from);
  }

  async send(to: string, subject: string | undefined, body: string): Promise<void> {
    const recipients = [new Recipient(to, to)];

    console.log("recipients", recipients);

    const emailParams = new EmailParams()
      .setFrom(this.from)
      .setTo(recipients)
      .setSubject(subject ?? "")
      .setHtml(body)
      .setText(body);

    console.log("emailParams", emailParams);

    try {
      await this.mailerSend.email.send(emailParams);
    } catch (error: any) {
      console.log("error", error);
      throw new Error(`Mailsend API error: ${error.message || error}`);
    }
  }
}
