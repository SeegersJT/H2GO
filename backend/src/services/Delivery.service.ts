import { Types } from "mongoose";
import { deliveryRepository } from "../repositories/Delivery.repository";
import { DeliveryStatus, IDelivery } from "../models/Delivery.model";
import { assetRepository } from "../repositories/Asset.repository";
import Route from "../models/Route.model";
import { inventoryMovementRepository } from "../repositories/InventoryMovement.repository";

export class DeliveryService {
  static getAll() {
    return deliveryRepository.findMany({});
  }

  static getById(id: string) {
    return deliveryRepository.findById(new Types.ObjectId(id));
  }

  static insertDelivery(data: Partial<IDelivery>, actorId: string) {
    return deliveryRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static updateDelivery(id: string, data: Partial<IDelivery>, actorId: string) {
    const delivery = this.getById(id);
    if (!delivery) {
      throw new Error("Invalid or inactive delivery");
    }

    return deliveryRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static deleteDelivery(id: string, actorId: string) {
    const delivery = this.getById(id);
    if (!delivery) {
      throw new Error("Invalid or inactive delivery");
    }

    return deliveryRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async setStatus(id: string, status: DeliveryStatus, actorId: string) {
    const doc = await deliveryRepository.setStatus(new Types.ObjectId(id), status, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
    if (doc) {
      return deliveryRepository.addEvent(
        new Types.ObjectId(id),
        { type: status, data: { status }, at: new Date() },
        actorId ? { actorId: new Types.ObjectId(actorId) } : undefined
      );
    }
    return doc;
  }

  static setProof(id: string, proof: NonNullable<IDelivery["proof"]>, actorId: string) {
    return deliveryRepository.setProof(new Types.ObjectId(id), proof, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static addEvent(id: string, event: { type: string; at?: Date; data?: any }, actorId: string) {
    return deliveryRepository.addEvent(new Types.ObjectId(id), event, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async swapProducts(deliveryId: string, outboundSerial: string, inboundSerial: string, actorId: string) {
    const delivery = await this.getById(deliveryId);
    if (!delivery) throw new Error("Invalid or inactive delivery");

    const route = await Route.findById(delivery.route_id).select("vehicle_id").lean();
    if (!route?.vehicle_id) throw new Error("Route vehicle not assigned");

    const emptyAsset = await assetRepository.findOne({ serial_no: outboundSerial.trim().toUpperCase() });
    const fullAsset = await assetRepository.findOne({ serial_no: inboundSerial.trim().toUpperCase() });
    if (!emptyAsset || !fullAsset) throw new Error("Invalid asset serial numbers");

    const now = new Date();
    const actor = actorId ? { actorId: new Types.ObjectId(actorId) } : undefined;

    await inventoryMovementRepository.create(
      {
        asset_id: fullAsset._id,
        quantity: 1,
        from_holder_type: "VEHICLE",
        from_holder_id: route.vehicle_id,
        to_holder_type: "CUSTOMER",
        to_holder_id: delivery.user_id,
        reason: "SWAP",
        reference_type: "DELIVERY",
        reference_id: delivery._id,
        moved_at: now,
      } as any,
      actor
    );

    await inventoryMovementRepository.create(
      {
        asset_id: emptyAsset._id,
        quantity: 1,
        from_holder_type: "CUSTOMER",
        from_holder_id: delivery.user_id,
        to_holder_type: "VEHICLE",
        to_holder_id: route.vehicle_id,
        reason: "SWAP",
        reference_type: "DELIVERY",
        reference_id: delivery._id,
        moved_at: now,
      } as any,
      actor
    );

    await assetRepository.updateHolder(fullAsset.id, "CUSTOMER", delivery.user_id, "FULL", now, actor);
    await assetRepository.updateHolder(emptyAsset.id, "VEHICLE", route.vehicle_id, "EMPTY", now, actor);

    await deliveryRepository.addEvent(
      delivery.id,
      {
        type: "swap",
        at: now,
        data: { outbound_Serial: outboundSerial, inbound_serial: inboundSerial },
      },
      actor
    );

    return this.getById(deliveryId);
  }
}
