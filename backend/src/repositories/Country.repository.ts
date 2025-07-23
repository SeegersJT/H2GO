import Country, { ICountry } from "../models/Country.model";

export const findAllCountries = async (): Promise<ICountry[]> => {
  return await Country.find({});
};

export const findCountryById = async (id: string): Promise<ICountry | null> => {
  return await Country.findById(id);
};

export const findCountryByCode = async (country_code: string): Promise<ICountry | null> => {
  return await Country.findOne({ country_code });
};

export const insertCountry = async (countryData: Partial<ICountry>): Promise<ICountry> => {
  return await Country.create(countryData);
};

export const updateCountry = async (id: string, updateData: Partial<ICountry>): Promise<ICountry | null> => {
  return await Country.findByIdAndUpdate(id, updateData, { new: true });
};
