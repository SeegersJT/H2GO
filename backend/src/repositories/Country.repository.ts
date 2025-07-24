import Country, { ICountry } from "../models/Country.model";

export class CountryRepository {
  static findAllCountries = async (): Promise<ICountry[]> => {
    return await Country.find({});
  };

  static findCountryById = async (id: string): Promise<ICountry | null> => {
    return await Country.findById(id);
  };

  static findCountryByCode = async (country_code: string): Promise<ICountry | null> => {
    return await Country.findOne({ country_code });
  };

  static insertCountry = async (countryData: Partial<ICountry>): Promise<ICountry> => {
    return await Country.create(countryData);
  };

  static updateCountry = async (id: string, updateData: Partial<ICountry>, updatedBy: string): Promise<ICountry | null> => {
    return await Country.findByIdAndUpdate(id, { ...updateData, updateBy: updatedBy }, { new: true });
  };
}
