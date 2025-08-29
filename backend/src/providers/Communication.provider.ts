export interface CommunicationProvider {
  send(to: string, subject: string | undefined, body: string): Promise<void>;
}
