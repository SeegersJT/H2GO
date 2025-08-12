import { ObjectId } from "./core";

export type DeliveryStatus = "SCHEDULED" | "ALLOCATED" | "ENROUTE" | "ARRIVED" | "COMPLETED" | "FAILED" | "CANCELLED";
export type ScheduleType = "ONCE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "CRON";

export interface IDeliveryLine {
  product: ObjectId;
  requestedQty: number;
  allocatedItems: ObjectId[];
  notes?: string;
}

export interface IDelivery {
  _id: ObjectId;
  customer: ObjectId;
  address: ObjectId;
  branch: ObjectId;
  driver?: ObjectId;
  plannedAt: Date;
  status: DeliveryStatus;
  lines: IDeliveryLine[];
  schedule?: ObjectId;
  audit: {
    enrouteAt?: Date;
    arrivedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
  };
  notes?: string;
}

export interface IDeliverySchedule {
  _id: ObjectId;
  customer: ObjectId;
  address: ObjectId;
  branch: ObjectId;
  type: ScheduleType;
  params?: { dayOfWeek?: number; dayOfMonth?: number; everyNWeeks?: number; cron?: string };
  defaultLines: { product: ObjectId; qty: number }[];
  nextRunAt: Date;
  isActive: boolean;
}
