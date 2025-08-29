import log from "../../utils/Logger";
import { CommunicationProvider } from "../Communication.provider";
import { DefaultEmailProvider } from "./DefaultEmail.provider";
import { MailsendEmailProvider } from "./MailsendEmail.provider";

export function getEmailProvider(): CommunicationProvider {
  switch (process.env.EMAIL_PROVIDER) {
    case "MAILSEND":
      log.success().provider("Mailsend - Email Provider Initialized");
      return new MailsendEmailProvider();
    default:
      log.success().provider("Default - Email Provider Initialized");
      return new DefaultEmailProvider();
  }
}
