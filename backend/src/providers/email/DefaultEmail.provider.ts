import { CommunicationProvider } from "../Communication.provider";

export class DefaultEmailProvider implements CommunicationProvider {
  async send(to: string, subject: string | undefined, body: string): Promise<void> {
    // Placeholder implementation; integrate with actual email service
    console.log(`Sending EMAIL to ${to}: ${subject}\n${body}`);
  }
}
