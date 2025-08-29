import type { Model, HydratedDocument } from "mongoose";
import CommunicationTemplateModel, { ICommunicationTemplate } from "../models/CommunicationTemplate.model";
import { GenericRepository } from "./Generic.repository";

export type CommunicationTemplateDoc = HydratedDocument<ICommunicationTemplate>;

export class CommunicationTemplateRepository extends GenericRepository<ICommunicationTemplate, CommunicationTemplateDoc> {
  constructor(model: Model<ICommunicationTemplate, any, any, any, CommunicationTemplateDoc> = CommunicationTemplateModel as any) {
    super(model);
  }
}

export const communicationTemplateRepository = new CommunicationTemplateRepository();
