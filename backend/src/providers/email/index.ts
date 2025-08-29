import { CommunicationProvider } from "../Communication.provider";
import { DefaultEmailProvider } from "./DefaultEmail.provider";

export function getEmailProvider(): CommunicationProvider {
  switch (process.env.EMAIL_PROVIDER) {
    default:
      return new DefaultEmailProvider();
  }
}
