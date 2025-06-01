import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import serviceAccount from '../../serviceAccountKey.json';
dotenv.config();

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const db = getFirestore();
export const JWT_SECRET = process.env.JWT_SECRET || 'random_jwt_secret';
export const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'false',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;