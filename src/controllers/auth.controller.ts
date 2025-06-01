import { Request, Response } from 'express';
import { db } from '../config';
import { generateCode } from '../utils/generateCode';
import { signJwt } from '../utils/jwt';
import { sendVerificationCode } from '../services/mail.service';

const userCollection = db.collection('users');

async function signup(req: Request, res: Response) {
  const { email, verificationCode } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const userSnapshot = await userCollection.where('email', '==', email).get();
  let userDoc = userSnapshot.docs[0];

  if (!userDoc) {
    // New signup, send code
    const code = generateCode();
    await userCollection.add({
      email,
      verificationCode: code,
      verified: false,
      createdAt: new Date().toISOString(),
    });
    await sendVerificationCode(email, code);
    return res.status(201).json({ message: 'Verification code sent to email' });
  } else {
    // Existing user, check code
    const user = userDoc.data();
    if (user.verified) return res.status(400).json({ error: 'User already exists' });

    if (verificationCode && verificationCode === user.verificationCode) {
      await userDoc.ref.update({ verified: true, verificationCode: null });
      return res.status(201).json({ id: userDoc.id, email });
    } else {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
  }
}

async function signin(req: Request, res: Response) {
  const { email, verificationCode } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const userSnapshot = await userCollection.where('email', '==', email).get();
  let userDoc = userSnapshot.docs[0];

  if (!userDoc) {
    // Send code if not exists
    const code = generateCode();
    await userCollection.add({
      email,
      verificationCode: code,
      verified: false,
      createdAt: new Date().toISOString(),
    });
    await sendVerificationCode(email, code);
    return res.status(400).json({ error: 'No such user, code sent for verification' });
  } else {
    const user = userDoc.data();
    if (!user.verified) {
      // Send code again
      const code = generateCode();
      await userDoc.ref.update({ verificationCode: code });
      await sendVerificationCode(email, code);
      return res.status(400).json({ error: 'User not verified, new code sent' });
    }
    if (verificationCode && verificationCode === user.verificationCode) {
      const token = signJwt({ id: userDoc.id, email: user.email });
      await userDoc.ref.update({ verificationCode: null }); // Invalidate code
      return res.status(200).json({ accessToken: token });
    } else {
      return res.status(401).json({ error: 'Invalid email or verification code' });
    }
  }
}

export default { signup, signin };