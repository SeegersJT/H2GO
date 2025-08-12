export enum UserType {
  DEVELOPER = "DEVELOPER",
  SUPER_USER = "SUPER_USER",
  ADMIN = "ADMIN",
  FINANCE = "FINANCE",
  BRANCH_ADMIN = "BRANCH_ADMIN",
  BRANCH_FINANCE = "BRANCH_FINANCE",
  DRIVER = "DRIVER",
  CUSTOMER = "CUSTOMER",
}

export const UserTypeHierarchy: UserType[] = [
  UserType.DEVELOPER,
  UserType.SUPER_USER,
  UserType.ADMIN,
  UserType.FINANCE,
  UserType.BRANCH_ADMIN,
  UserType.BRANCH_FINANCE,
  UserType.DRIVER,
  UserType.CUSTOMER,
];
