import { Request, Response } from 'express';
import { db } from '../config';
import { generateCode } from '../utils/generateCode';
import { signJwt } from '../utils/jwt';
import { sendVerificationCode } from '../services/mail.service';

const userCollection = db.collection('users');

// Signup flow
async function signup(req: Request, res: Response) {
  const { email, verificationCode } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const userSnapshot = await userCollection.where('email', '==', email).get();
  let userDoc = userSnapshot.docs[0];

  if (!userDoc) {
    // New signup, send code
    const code = generateCode();
    // Create user document first
    const newUserDoc = await userCollection.add({
      email,
      verificationCode: code,
      verified: false,
      createdAt: new Date().toISOString(),
    });

    // Update with ID
    await newUserDoc.update({
      id: newUserDoc.id
    });
    await sendVerificationCode(email, code);
    return res.status(201).json({ message: 'Verification code sent to email' });
  }

  // Existing user, check code
  const user = userDoc.data();
  if (user.verified) return res.status(400).json({ error: 'User already exists' });

  if (verificationCode && verificationCode === user.verificationCode) {
    await userDoc.ref.update({ verified: true, verificationCode: null });
    return res.status(201).json({ id: userDoc.id, email });
  }

  return res.status(400).json({ error: 'Invalid verification code' });
}

// Signin flow
// async function verifySignin(req: Request, res: Response) {
//   const { email, verificationCode } = req.body;
//   if (!email) return res.status(400).json({ error: 'Email is required' });

//   const userSnapshot = await userCollection.where('email', '==', email).get();
//   let userDoc = userSnapshot.docs[0];
//   if (!userDoc) {
//     const code = generateCode();
//     await userCollection.add({
//       email,
//       verificationCode: code,
//       verified: false,
//       createdAt: new Date().toISOString(),
//     });
//     await sendVerificationCode(email, code);
//     return res.status(400).json({ error: 'No such user, code sent for verification' });
//   }

//   const user = userDoc.data();

//   if (verificationCode && verificationCode === user.verificationCode) {
//     const token = signJwt({ id: userDoc.id, email: user.email });
//     const userData = {
//       id: userDoc.id,
//       email: user.email,
//     };
//     await userDoc.ref.update({ verificationCode: null, verified: true }); // Invalidate code and mark as verified
//     return res.status(200).json({ 
//       accessToken: token,
//       user: userData
//     });
//   }

//   return res.status(401).json({ error: 'Invalid email or verification code' });
// }

async function verifySignin(req: Request, res: Response) {
  const { email, verificationCode } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const userSnapshot = await userCollection.where('email', '==', email).get();
  let userDoc = userSnapshot.docs[0];
  if (!userDoc) {
    const code = generateCode();
    await userCollection.add({
      email,
      verificationCode: code,
      verified: false,
      createdAt: new Date().toISOString(),
    });
    await sendVerificationCode(email, code);
    return res.status(400).json({ error: 'No such user, code sent for verification' });
  }

  const user = userDoc.data();
  // if (!user.verified) {
  //   const code = generateCode();
  //   await userDoc.ref.update({ verificationCode: code });
  //   await sendVerificationCode(email, code);
  //   return res.status(400).json({ error: 'User not verified, new code sent' });
  // }

  const token = signJwt({ id: userDoc.id, email: user.email });
  const userData = {
    id: userDoc.id,
    email: user.email,
  };
  // await userDoc.ref.update({ verificationCode: null, verified: true });
  return res.status(200).json({
    accessToken: token,
    user: userData
  });
}

async function signin(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const userSnapshot = await userCollection.where('email', '==', email).get();
  let userDoc = userSnapshot.docs[0];

  if (!userDoc) {
    return res.status(400).json({ error: 'No such user exists' });
  }

  // const user = userDoc.data();
  // if (user.verified) {
  //   return res.status(400).json({ error: 'User already verified' });
  // }

  // Generate and send new verification code
  // const code = generateCode();
  // await userDoc.ref.update({ verificationCode: code });
  // await sendVerificationCode(email, code);
  return res.status(200).json({ message: 'Verification code sent to email' });
}

export default { signup, signin, verifySignin };