import { Request, Response, NextFunction } from "express";
import { AddressService } from "../services/Address.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { Types } from "mongoose";

export class AddressController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AddressService.getAllAddresses();

      return res.success(result, { message: "Retrieved all addresses successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = req.query.address_id as string;

      if (!addressId) {
        return res.error(null, {
          message: "[address_id] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AddressService.getAddressbyId(addressId);

      return res.success(result, { message: "Retrieved addresses by ID successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        user_id,
        country_id,
        label,
        address_line_01,
        suburb,
        city,
        region,
        postal_code,
        lat,
        lng,
        delivery_instructions,
        contact_person,
        contact_phone,
      } = req.body;

      if (
        !user_id ||
        !country_id ||
        !label ||
        !address_line_01 ||
        !suburb ||
        !city ||
        !region ||
        !postal_code ||
        !lat ||
        !lng ||
        !delivery_instructions ||
        !contact_person ||
        !contact_phone
      ) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const newAddress = await AddressService.insertAddress(req.body, authenticatedUser.id);

      return res.success(newAddress, { message: "Address created successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = req.query.address_id as string;
      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const updateData: any = { ...req.body, updatedBy: new Types.ObjectId(authenticatedUser.id) };

      if (updateData.user_id) updateData.user_id = new Types.ObjectId(updateData.user_id);
      if (updateData.country_id) updateData.country_id = new Types.ObjectId(updateData.country_id);

      const updated = await AddressService.updateAddress(addressId, updateData, authenticatedUser.id);

      if (!updated) {
        return res.error(null, { message: "Address not found", code: StatusCode.NOT_FOUND });
      }

      return res.success(updated, { message: "Address updated successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = req.query.address_id as string;
      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const deleted = await AddressService.deleteAddress(addressId, authenticatedUser.id);

      if (!deleted) {
        return res.error(null, { message: "Address not found", code: StatusCode.NOT_FOUND });
      }

      return res.success(deleted, { message: "Address deleted successfully." });
    } catch (err) {
      next(err);
    }
  };
}
