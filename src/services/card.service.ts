import { db } from '../config';

export const CardService = {
  async getAllCards(boardId: string, userId: string) {
    const cardsRef = db.collection('boards').doc(boardId).collection('cards');
    const snapshot = await cardsRef.where('list_member', 'array-contains', userId).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      boardId,
      ...doc.data()
    }));
  },

  async createCard(boardId: string, { name, description, createdAt, ownerId }: any) {
    const cardsRef = db.collection('boards').doc(boardId).collection('cards');
    const cardData = {
      name, description, ownerId,
      createdAt: createdAt || new Date().toISOString(),
      list_member: [ownerId],
      tasks_count: 0
    };
    const docRef = await cardsRef.add(cardData);
    return { id: docRef.id, ...cardData };
  },

  async getCardById(boardId: string, cardId: string, userId: string) {
    const cardDoc = await db.collection('boards').doc(boardId).collection('cards').doc(cardId).get();
    if (!cardDoc.exists) throw { status: 404, message: 'Card not found' };
    const card = cardDoc.data();
    if (!card?.list_member?.includes(userId)) throw { status: 403, message: 'No access' };
    return { id: cardDoc.id, ...card };
  },

  async updateCard(boardId: string, cardId: string, userId: string, { name, description, ...params }: any) {
    const cardRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId);
    const cardDoc = await cardRef.get();
    if (!cardDoc.exists) throw { status: 404, message: 'Card not found' };
    const card = cardDoc.data();
    if (card!.ownerId !== userId) throw { status: 403, message: 'Not card owner' };
    const updateData = { name, description, ...params };
    await cardRef.update(updateData);
    return { id: cardId, ...card, ...updateData };
  },

  async deleteCard(boardId: string, cardId: string, userId: string) {
    const cardRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId);
    const cardDoc = await cardRef.get();
    if (!cardDoc.exists) throw { status: 404, message: 'Card not found' };
    const card = cardDoc.data();
    if (card!.ownerId !== userId) throw { status: 403, message: 'Not card owner' };
    await cardRef.delete();
    // Optionally: delete related tasks
  },

  async getCardsByUser(boardId: string, userId: string) {
    const cardsRef = db.collection('boards').doc(boardId).collection('cards');
    const snapshot = await cardsRef.where('list_member', 'array-contains', userId).get();
    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const tasksSnap = await doc.ref.collection('tasks').get();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        tasks_count: tasksSnap.size,
        list_member: data.list_member,
        createdAt: data.createdAt
      };
    }));
  },

  async acceptInvite({ invite_id, card_id, member_id, status }: any) {
    const inviteRef = db.collection('invites').doc(invite_id);
    await inviteRef.update({ status });
    if (status === 'accepted') {
      // Add member to card's list_member
      const cardRef = db.collectionGroup('cards').where('id', '==', card_id);
      // Firestore doesn't support direct update by id in group, so:
      // You should know parent boardId, or keep boardId in invite
      // For simplicity, let's assume you have boardId
      // Otherwise, fetch card by card_id and update list_member
    }
  }
}