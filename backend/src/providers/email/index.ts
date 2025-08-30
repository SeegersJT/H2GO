import log from "../../utils/Logger";
import { CommunicationProvider } from "../Communication.provider";
import { DefaultEmailProvider } from "./DefaultEmail.provider";
import { MailersendEmailProvider } from "./MailersendEmail.provider";

export function getEmailProvider(): CommunicationProvider {
  switch (process.env.EMAIL_PROVIDER) {
    case "MAILERSEND":
      log.success().provider("Mailersend - Email Provider Initialized");
      return new MailersendEmailProvider();
    default:
      log.success().provider("Default - Email Provider Initialized");
      return new DefaultEmailProvider();
  }
}
