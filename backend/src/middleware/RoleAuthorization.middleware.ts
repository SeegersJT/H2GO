import { NextFunction, Request, Response } from "express";
import { UserType, UserTypeHierarchy } from "../utils/constants/UserType.constant";
import { StatusCode } from "../utils/constants/StatusCode.constant";

const roleAuthorizationMiddleware = (minimumRequiredType: UserType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authenticatedUser = req.authenticatedUser;

    if (!authenticatedUser || !authenticatedUser.user_type) {
      return res.error(null, {
        message: "Unauthorized",
        code: StatusCode.UNAUTHORIZED,
      });
    }

    const userRank = UserTypeHierarchy.indexOf(authenticatedUser.user_type);
    const minRank = UserTypeHierarchy.indexOf(minimumRequiredType);

    if (userRank === -1 || minRank === -1 || userRank > minRank) {
      return res.error(null, {
        message: "Forbidden",
        code: StatusCode.FORBIDDEN,
      });
    }

    return next();
  };
};

export default roleAuthorizationMiddleware;
