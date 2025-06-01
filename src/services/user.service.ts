import { db } from '../config';

export const UserService = {
  async getAllInvites(userId: string) {
    // Find invites where member_id equals this user
    const snapshot = await db.collection('invites')
      .where('member_id', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};