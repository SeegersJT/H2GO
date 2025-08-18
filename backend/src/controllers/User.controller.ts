import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { UserService } from "../services/User.service";

export class UserController {
  static getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getAllUsers();

      return res.success(users, {
        message: "Retrieved users successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.query.user_id as string;
      const user = await UserService.getUserById(userId);

      return res.success(user, {
        message: "Retrieved user successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static insertUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { branch_id, name, surname, id_number, email_address, mobile_number, gender, password, user_type } = req.body;

      if (!branch_id || !name || !surname || !id_number || !email_address || !mobile_number || !gender || !password || !user_type) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await UserService.insertUser(req.body, authenticatedUser.id);

      if (!result) {
        return res.error(result, { message: "Invalid or inactive product.", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result.toJSON(), { message: "Inserted user successfully" });
    } catch (err) {
      next(err);
    }
  };

  static updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const updatedUser = await UserService.updateUser(userId, req.body, authenticatedUser.id);

      return res.success(updatedUser, {
        message: "Updated user successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.error(null, {
          message: "[id] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await UserService.deleteUser(id, authenticatedUser.id);
      return res.success(result, { message: "Deleted user successfully" });
    } catch (err) {
      next(err);
    }
  };
}
