import { CommunicationProvider } from "../Communication.provider";
import { DefaultEmailProvider } from "./DefaultEmail.provider";
import { MailsendEmailProvider } from "./MailsendEmail.provider";

export function getEmailProvider(): CommunicationProvider {
  switch (process.env.EMAIL_PROVIDER) {
    case "MAILSEND":
      return new MailsendEmailProvider();
    default:
      return new DefaultEmailProvider();
  }
}
