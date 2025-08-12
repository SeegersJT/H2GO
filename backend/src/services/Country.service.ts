import BaseService from "./Base.service";
import CountryRepository from "../repositories/Country.repository";
import { ICountry } from "../../models/Country.model";

class CountryService extends BaseService<ICountry> {
  findByIso(iso: string) {
    return CountryRepository.findByIso(iso);
  }
}
export default new CountryService(CountryRepository);
