import BaseRepository from "./Base.repository";
import Country from "../models/Country.model";
import { ICountry } from "../types/location";

class CountryRepository extends BaseRepository<ICountry> {
  findByIso(iso2Or3: string) {
    return this.findOne({ $or: [{ iso2: iso2Or3.toUpperCase() }, { iso3: iso2Or3.toUpperCase() }] } as any, { lean: true });
  }
}

export default new CountryRepository(Country);
