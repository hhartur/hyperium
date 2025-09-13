import prisma from './prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function verifyPassword(password: string, hash: string) {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}

async function sendVerificationEmail(email: string, token: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const verificationUrl = `http://localhost:3000/api/auth/verify-email/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email address',
      html: `Please click this link to verify your email address: <a href="${verificationUrl}">${verificationUrl}</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

export async function createUser(email: string, username: string, password: string) {
  const passwordHash = await hashPassword(password);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password_hash: passwordHash,
      email_verification_token: verificationToken,
    },
  });

  await sendVerificationEmail(email, verificationToken);

  return user;
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.update({
    where: {
      email_verification_token: token,
    },
    data: {
      email_verified: true,
      email_verification_token: null,
    },
  });
  return user;
}

export async function createSession(userId: string) {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await prisma.session.create({
    data: {
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt,
    },
  });

  return session.session_token;
}

export async function getSession(sessionToken: string) {
  const session = await prisma.session.findUnique({
    where: {
      session_token: sessionToken,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          email_verified: true,
          is_admin: true,
          avatar_url: true,
        },
      },
    },
  });

  if (!session || session.expires_at < new Date()) {
    return null;
  }

  return session.user;
}

export async function deleteSession(sessionToken: string) {
  await prisma.session.delete({
    where: {
      session_token: sessionToken,
    },
  });
}

export async function login(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await verifyPassword(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const sessionToken = await createSession(user.id);
  return sessionToken;
}