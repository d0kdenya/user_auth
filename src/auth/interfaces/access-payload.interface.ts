import { JwtPayload } from './jwt-payload.interface';

export interface AccessPayload extends JwtPayload {
  id: number;
  login: string;
  username: string;
}
