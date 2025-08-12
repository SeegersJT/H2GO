import { ICountry } from "../models/Country.model";

import { CountryRepository } from "../repositories/Country.repository";

export class CountryService {
  static getAllCountries = async (): Promise<ICountry[]> => {
    return await CountryRepository.findAllCountries();
  };

  static getCountryById = async (id: string): Promise<ICountry | null> => {
    return await CountryRepository.findCountryById(id);
  };

  static getCountryByCode = async (country_code: string): Promise<ICountry | null> => {
    return await CountryRepository.findCountryByCode(country_code);
  };

  static insertCountry = async (countryData: Partial<ICountry>): Promise<ICountry> => {
    return await CountryRepository.insertCountry(countryData);
  };

  static updateCountry = async (id: string, updateData: Partial<ICountry>, updatedBy: string): Promise<ICountry | null> => {
    return await CountryRepository.updateCountry(id, updateData, updatedBy);
  };
}
