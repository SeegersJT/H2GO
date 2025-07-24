import { AuthenticatedUserPayload } from "../AuthenticatedUserPayload";

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUserPayload;
    }
  }
}

export {};
