import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookie } from '../services/auth.js';
import { Session } from '../models/session.js';
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existUser = await User.findOne({ email });

  if (existUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);

  setSessionCookie(res, newSession);

  res.status(201).json({ newUser });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookie(res, newSession);
  res.status(200).json(user);
};
export const logoutUser = async (req, res, next) => {
  const { sessionId } = req.cookies;

  if (!sessionId) {
    next(createHttpError(401, "Invalid session"))
  }

  await Session.deleteOne({ _id: sessionId })

  res.clearCookie("accessToken")
  res.clearCookie("refreshToken")
  res.clearCookie("sessionId")

  res.status(204).send()

}
