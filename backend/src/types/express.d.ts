import { AuthPayload } from './index';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthPayload;
  }
}
