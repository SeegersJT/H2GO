import { Types } from "mongoose";
import { countryRepository } from "../repositories/Country.repository";
import type { ICountry } from "../models/Country.model";

export class CountryService {
  static async getAllCountries() {
    return countryRepository.findMany({});
  }

  static async getCountryById(id: string) {
    return countryRepository.findById(new Types.ObjectId(id));
  }

  static async insertCountry(data: Partial<ICountry>) {
    return countryRepository.create(data);
  }

  static async updateCountry(id: string, data: Partial<ICountry>, actorId: string) {
    return countryRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }
}
