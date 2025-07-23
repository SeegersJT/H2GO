import { Router } from "express";
import * as countryController from "../../../../controllers/Country.controller";

const router = Router();

router.get("/all", countryController.getAllCountries);
router.get("/:id", countryController.getCountryById);

router.post("/", countryController.insertCountry);

router.put("/:id", countryController.updateCountry);

export default router;
