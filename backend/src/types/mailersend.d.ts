declare module "mailersend" {
  export class MailerSend {
    constructor(options: any);
    email: { send(params: any): Promise<any> };
  }
  export class EmailParams {
    setFrom(from: any): this;
    setTo(to: any[]): this;
    setSubject(subject: string): this;
    setHtml(html: string): this;
    setText(text: string): this;
  }
  export class Sender {
    constructor(email: string, name: string);
  }
  export class Recipient {
    constructor(email: string, name: string);
  }
}
