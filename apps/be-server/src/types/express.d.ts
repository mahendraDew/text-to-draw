import { JwtPayload } from "jsonwebtoken";

interface User {
  id: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      // user?: User;
      userId: string
    }
  }
}