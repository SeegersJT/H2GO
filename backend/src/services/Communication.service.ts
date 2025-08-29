import { Types } from "mongoose";
import { communicationTemplateRepository } from "../repositories/CommunicationTemplate.repository";
import { communicationRequestRepository } from "../repositories/CommunicationRequest.repository";
import { userRepository } from "../repositories/User.repository";
import { CommunicationMethod, CommunicationStatus } from "../utils/constants/Communication.constant";

interface CommunicationProvider {
  send(to: string, subject: string | undefined, body: string): Promise<void>;
}

class EmailProvider implements CommunicationProvider {
  async send(to: string, subject: string | undefined, body: string): Promise<void> {
    // Placeholder implementation; integrate with actual email service
    console.log(`Sending EMAIL to ${to}: ${subject}\n${body}`);
  }
}

class SmsProvider implements CommunicationProvider {
  async send(to: string, _subject: string | undefined, body: string): Promise<void> {
    // Placeholder implementation; integrate with actual SMS service
    console.log(`Sending SMS to ${to}: ${body}`);
  }
}

const providers: Record<CommunicationMethod, CommunicationProvider> = {
  [CommunicationMethod.EMAIL]: new EmailProvider(),
  [CommunicationMethod.SMS]: new SmsProvider(),
};

function parseTemplate(template: string, params: Record<string, any> = {}): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_: string, key: string) => params[key] ?? "");
}

export class CommunicationService {
  static async sendCommunication(userId: string, templateNo: string, params: Record<string, any> = {}, actorId: string) {
    const template = await communicationTemplateRepository.findOne({ template_no: templateNo });
    if (!template) {
      throw new Error("Template not found");
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const request = await communicationRequestRepository.create(
      {
        user_id: user._id,
        template_id: template._id,
        status: CommunicationStatus.REQUESTED,
        handled: false,
      },
      { actorId }
    );

    const provider = providers[template.method as CommunicationMethod];
    const body = parseTemplate(template.body, params);
    const to = template.method === CommunicationMethod.EMAIL ? user.email_address : user.mobile_number;

    try {
      await provider.send(to, template.subject, body);
      return communicationRequestRepository.updateById(
        request._id,
        {
          status: CommunicationStatus.DELIVERED,
          handled: true,
          handle_result: "Delivered",
          sent_at: new Date(),
        },
        { actorId, new: true }
      );
    } catch (err: any) {
      await communicationRequestRepository.updateById(
        request._id,
        {
          status: CommunicationStatus.ERROR,
          handled: true,
          handle_result: err?.message || "Error",
        },
        { actorId }
      );
      throw err;
    }
  }
}
