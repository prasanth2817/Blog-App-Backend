import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

const hashCompare = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const createToken = async (payload) => {
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRECT, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return token;
  } catch (error) {
    console.error('Error creating token:', error);
  }
};

const decodeToken = async (token) => {
  const payload = await jwt.decode(token);
  return payload;
};


export default {
    hashCompare,
    hashPassword,
    createToken,
    decodeToken
}