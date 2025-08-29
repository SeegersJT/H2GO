import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { CommunicationService } from "../services/Communication.service";

export class CommunicationController {
  static send = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, template_no, params } = req.body;

      if (!user_id || !template_no) {
        return res.error(null, {
          message: "[user_id, template_no] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await CommunicationService.sendCommunication(user_id, template_no, params, authenticatedUser.id);

      return res.success(result, { message: "Communication processed" });
    } catch (err) {
      next(err);
    }
  };
}
