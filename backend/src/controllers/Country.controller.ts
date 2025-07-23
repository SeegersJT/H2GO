import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as countryService from "../services/Country.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export const getAllCountries = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await countryService.getAllCountries();
    return res.succeed(countries, { message: "Retrieved countries successfully" });
  } catch (err) {
    next(err);
  }
};

export const getCountryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countryId = req.params.id;
    const country = await countryService.getCountryById(countryId);

    if (!country) {
      return res.fail(null, {
        message: "Country not found",
        code: StatusCode.NOT_FOUND,
      });
    }

    return res.succeed(country, { message: "Retrieved country successfully" });
  } catch (err) {
    next(err);
  }
};

export const insertCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      country_name,
      country_code,
      country_dial_code,
      max_phone_number_length,
      createdBy,
      updatedBy,
    } = req.body;

    if (
      !country_name ||
      !country_code ||
      !country_dial_code ||
      !max_phone_number_length ||
      !createdBy ||
      !updatedBy
    ) {
      return res.fail(null, { message: "Missing required fields" });
    }

    const newCountry = await countryService.insertCountry({
      country_name,
      country_code,
      country_dial_code,
      max_phone_number_length,
      createdBy: new Types.ObjectId(createdBy), // TODO: Replace with Authenticated User Id
      updatedBy: new Types.ObjectId(updatedBy), // TODO: Replace with Authenticated User Id
    });

    return res.succeed(newCountry, { message: "Country created successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countryId = req.params.id;
    const updateData = req.body;

    const updated = await countryService.updateCountry(countryId, updateData);

    if (!updated) {
      return res.fail(null, { message: "Country not found", code: StatusCode.NOT_FOUND });
    }

    return res.succeed(updated, { message: "Country updated successfully" });
  } catch (err) {
    next(err);
  }
};
