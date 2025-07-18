import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import * as userService from '../../services/user/User.service'
import { HttpError } from "../../utils/errors/CustomErrors.util";
import { StatusCode } from "../../utils/constants/StatusCode.constant";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const users = await userService.getAllUsers();

   return res.succeed(users, {
      message: "Successfully Retrieved Users",
      code: StatusCode.OK,
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      throw new HttpError("Failed to retrieve User", StatusCode.NOT_FOUND);
    }
   
    return res.succeed(user, {
      message: "Successfully Retrieved User",
      code: StatusCode.OK,
    });
  } catch (error) {
    next(error);
  }
};


export const insertUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      surname,
      id_number,
      email_address,
      mobile_number,
      gender,
      password,
      user_type,
      company_id,
      createdBy,
      updatedBy,
    } = req.body;

    if (
      !name || !surname || !id_number || !email_address || !mobile_number || !gender ||
      !password || !user_type || !createdBy || !updatedBy
    ) {
      throw new HttpError('Missing required fields', StatusCode.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user_no = await generateUserNo(data.company_id);

    const newUser = await userService.insertUser({
      user_no: user_no,
      name,
      surname,
      id_number,
      email_address,
      mobile_number,
      gender,
      password: hashedPassword,
      user_type,
      company_id,
      confirmed: false,
      active: true,
      createdBy,
      updatedBy,
    });

    
    const userWithoutPassword = { ...newUser.toObject(), password: undefined };

    res.succeed(userWithoutPassword, {
      message: 'Successfully Created User',
      code: StatusCode.OK
    })

  } catch (error) {
    console.log('error 1', error)
    next(error);
  }
};

const generateUserNo = async (companyId: Types.ObjectId): Promise<string> => {
  const company = await Company.findById(companyId);
  const abbrev = company?.abbreviation || 'XXX';

  const count = await User.countDocuments({ company_id: companyId });

  // Optionally: pad numbers to 4 digits
  const userNo = `USER-${abbrev.toUpperCase()}-${(count + 1).toString().padStart(4, '0')}`;

  return userNo;
};