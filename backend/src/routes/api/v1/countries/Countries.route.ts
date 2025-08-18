import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";

import { CountryController } from "../../../../controllers/Country.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);

router.get("/all", restricted, CountryController.getAllCountries);
router.get("/", restricted, CountryController.getCountryById);
router.post("/", restricted, CountryController.insertCountry);
router.put("/", restricted, CountryController.updateCountry);

export default router;
