import log from "../../utils/Logger";
import { CommunicationProvider } from "../Communication.provider";
import { DefaultEmailProvider } from "./DefaultEmail.provider";
import { MailsendEmailProvider } from "./MailsendEmail.provider";

export function getEmailProvider(): CommunicationProvider {
  switch (process.env.EMAIL_PROVIDER) {
    case "MAILSEND":
      log.success().provider("Email provider - Mailsend Initialized");
      return new MailsendEmailProvider();
    default:
      log.success().provider("Email provider - Default Initialized");
      return new DefaultEmailProvider();
  }
}
