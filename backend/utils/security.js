import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const createAccessToken = (email) => {
  return jwt.sign(
    { sub: email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};
