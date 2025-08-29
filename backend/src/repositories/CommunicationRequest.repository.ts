import type { Model, HydratedDocument } from "mongoose";
import CommunicationRequestModel, { ICommunicationRequest } from "../models/CommunicationRequest.model";
import { GenericRepository } from "./Generic.repository";

export type CommunicationRequestDoc = HydratedDocument<ICommunicationRequest>;

export class CommunicationRequestRepository extends GenericRepository<ICommunicationRequest, CommunicationRequestDoc> {
  constructor(model: Model<ICommunicationRequest, any, any, any, CommunicationRequestDoc> = CommunicationRequestModel as any) {
    super(model);
  }
}

export const communicationRequestRepository = new CommunicationRequestRepository();
