import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { CountryService } from "../services/Country.service";

export class CountryController {
  static getAllCountries = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const countries = await CountryService.getAllCountries();
      return res.success(countries, { message: "Retrieved countries successfully" });
    } catch (err) {
      next(err);
    }
  };

  static getCountryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryId = req.params.id;
      const country = await CountryService.getCountryById(countryId);

      if (!country) {
        return res.error(null, {
          message: "Country not found",
          code: StatusCode.NOT_FOUND,
        });
      }

      return res.success(country, { message: "Retrieved country successfully" });
    } catch (err) {
      next(err);
    }
  };

  static insertCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { country_name, country_code, country_dial_code, max_phone_number_length } = req.body;

      if (!country_name || !country_code || !country_dial_code || !max_phone_number_length) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const newCountry = await CountryService.insertCountry({
        country_name,
        country_code,
        country_dial_code,
        nsn_max_length: max_phone_number_length,
        createdBy: new Types.ObjectId(authenticatedUser.id),
        updatedBy: new Types.ObjectId(authenticatedUser.id),
      });

      return res.success(newCountry, { message: "Country created successfully" });
    } catch (err) {
      next(err);
    }
  };

  static updateCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryId = req.params.id;
      const updateData = req.body;
      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const updated = await CountryService.updateCountry(countryId, updateData, authenticatedUser.id);

      if (!updated) {
        return res.error(null, { message: "Country not found", code: StatusCode.NOT_FOUND });
      }

      return res.success(updated, { message: "Country updated successfully" });
    } catch (err) {
      next(err);
    }
  };
}
