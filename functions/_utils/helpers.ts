import { Request } from 'express';
import jwt from 'jsonwebtoken';

export type UserHasuraClaims = {
  'x-hasura-user-id': string;
  'x-hasura-default-role': string;
  'x-hasura-allowed-roles': string[];
};

export type User = {
  id: string;
  defaultRole: string;
  allowedRoles: string[];
};

export const getUser = (req: Request): User | null => {
  const authorizationHeader = req.headers['authorization'];
  const accessToken = authorizationHeader?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  const jwtSecret = JSON.parse(process.env.NHOST_JWT_SECRET as string);
  const decodedToken = jwt.verify(accessToken, jwtSecret.key) as any;

  const hasuraClaims = decodedToken[
    'https://hasura.io/jwt/claims'
  ] as UserHasuraClaims;

  const user = {
    id: hasuraClaims['x-hasura-user-id'],
    defaultRole: hasuraClaims['x-hasura-default-role'],
    allowedRoles: hasuraClaims['x-hasura-allowed-roles']
  };

  return user;
};
