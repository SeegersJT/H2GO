import { Request, Response, NextFunction } from "express";
import { AddressService } from "../services/Address.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class AddressController {
  static getAllAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AddressService.getAllAddresses();

      return res.succeed(result, { message: "Retrieved all addresses successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getAddressbyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = req.query.address_id as string;

      if (!addressId) {
        return res.fail(null, {
          message: "[address_id] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AddressService.getAddressbyId(addressId);

      return res.succeed(result, { message: "Retrieved addresses by ID successfully." });
    } catch (err) {
      next(err);
    }
  };
}
