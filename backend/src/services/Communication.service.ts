import { Types } from "mongoose";
import { communicationTemplateRepository } from "../repositories/CommunicationTemplate.repository";
import { communicationRequestRepository } from "../repositories/CommunicationRequest.repository";
import { userRepository } from "../repositories/User.repository";
import { CommunicationMethod, CommunicationStatus } from "../utils/constants/Communication.constant";
import { CommunicationProvider } from "../providers/Communication.provider";
import { getEmailProvider } from "../providers/email";

class SmsProvider implements CommunicationProvider {
  async send(to: string, _subject: string | undefined, body: string): Promise<void> {
    // Placeholder implementation; integrate with actual SMS service
    console.log(`Sending SMS to ${to}: ${body}`);
  }
}

const providers: Record<CommunicationMethod, CommunicationProvider> = {
  [CommunicationMethod.EMAIL]: getEmailProvider(),
  [CommunicationMethod.SMS]: new SmsProvider(),
};

function renderTemplate(template: string, params: Record<string, any> = {}): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_: string, key: string) => params[key] ?? "");
}

export class CommunicationService {
  static async sendCommunication(userId: string, templateId: string, params: Record<string, any> = {}, actorId: string) {
    const template = await communicationTemplateRepository.findById(templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    console.log("template", template);

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    console.log("user", user);

    const request = await communicationRequestRepository.create(
      {
        user_id: user._id,
        template_id: template._id,
        status: CommunicationStatus.REQUESTED,
        handled: false,
      },
      { actorId: new Types.ObjectId(actorId) }
    );

    console.log("request", request);

    const provider = providers[template.method as CommunicationMethod];
    const body = renderTemplate(template.body, params);
    const to = template.method === CommunicationMethod.EMAIL ? user.email_address : user.mobile_number;

    console.log("provider", provider);
    console.log("body", body);
    console.log("to", to);

    try {
      console.log("here");
      await provider.send(to, template.subject, body);
      console.log("here2");

      return communicationRequestRepository.updateById(
        request._id,
        {
          status: CommunicationStatus.DELIVERED,
          handled: true,
          handle_result: "Delivered",
          sent_at: new Date(),
        },
        { actorId: new Types.ObjectId(actorId), new: true }
      );
    } catch (err: any) {
      console.log("err", err);
      await communicationRequestRepository.updateById(
        request._id,
        {
          status: CommunicationStatus.ERROR,
          handled: true,
          handle_result: err?.message || "Error",
        },
        { actorId: new Types.ObjectId(actorId) }
      );
      throw err;
    }
  }
}
