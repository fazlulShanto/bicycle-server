import jwt from 'jsonwebtoken';
import path from 'path';

import { SessionData } from '../interfaces/session.interface';

import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const SECRET_KEY: string = process.env.SECRET_KEY || 'HELLO WORLD';
const blockedList: string[] = [];

const createSession = (userEmail: string) => {
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 1);

  const newSession: SessionData = {
    expiresAt: expiry.valueOf(),
    userEmail: userEmail,
  };

  return jwt.sign(newSession, SECRET_KEY);
};

const getSession = (token: string) => {
  try {
    if (blockedList.includes(token)) return undefined;

    const sessionData: SessionData | undefined = jwt.verify(
      token,
      SECRET_KEY
    ) as unknown as SessionData;
    if (sessionData.expiresAt < Date.now()) {
      console.log('Token has expired.');
      return undefined;
    }

    return sessionData;
  } catch (error) {
    console.error('Error verifying token:', error);
    return undefined;
  }
};

const decodeJWT = (token : string)=>{
  try {
    console.log(`token = ${token}`)
    const tokenData  = jwt.verify(
      token,
      SECRET_KEY,{
        ignoreExpiration:true,
      }
    ) as unknown as SessionData;


    return tokenData;
  } catch (error) {
    console.error('new Error: Error verifying token:', error);
    return undefined;
  }
}

const destroySession = (token: string): boolean => {
  blockedList.push(token);
  return true;
};

export { createSession, getSession, destroySession , decodeJWT };
