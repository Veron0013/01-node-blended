import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookie } from '../services/auth.js';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { sendMail } from '../utils/sendMail.js';

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

export const resetMail = async (req, res) => {

  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(200).json({ message: "E-mail sent" })
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )

  // 1. Формуємо шлях до шаблона
  const templatePath = path.resolve('src/templates/reset-password-email.html');
  // 2. Читаємо шаблон
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  // 3. Готуємо шаблон до заповнення
  const template = handlebars.compile(templateSource);
  // 4. Формуємо із шаблона HTML документ з динамічними даними
  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
    await sendMail(
      {
        to: email,
        subject: "Reset password",
        html,
        from: process.env.SMTP_FROM
      }
    )

  } catch (error) {
    throw createHttpError(500, error)
  }

  return res.status(200).json({ message: "E-mail send successfully" })

}
