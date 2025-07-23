import * as countryRepository from "../repositories/Country.repository";
import { ICountry } from "../models/Country.model";

export const getAllCountries = async (): Promise<ICountry[]> => {
  return await countryRepository.findAllCountries();
};

export const getCountryById = async (id: string): Promise<ICountry | null> => {
  return await countryRepository.findCountryById(id);
};

export const getCountryByCode = async (country_code: string): Promise<ICountry | null> => {
  return await countryRepository.findCountryByCode(country_code);
};

export const insertCountry = async (countryData: Partial<ICountry>): Promise<ICountry> => {
  return await countryRepository.insertCountry(countryData);
};

export const updateCountry = async (
  id: string,
  updateData: Partial<ICountry>
): Promise<ICountry | null> => {
  return await countryRepository.updateCountry(id, updateData);
};
