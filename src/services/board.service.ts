import { db } from '../config';

export const BoardService = {
  // Create a new board with ownerId
  async createBoard({ name, description, ownerId }: { name: string; description: string; ownerId: string }) {
    const boardRef = db.collection('boards').doc();
    const board = {
      id: boardRef.id,
      name,
      description,
      ownerId,
      members: [ownerId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await boardRef.set(board);
    return board;
  },

  // Get all boards where the user is a member
  async getBoardsByUser(userId: string) {
    const boardsSnap = await db
      .collection('boards')
      .where('members', 'array-contains', userId)
      .get();
    return boardsSnap.docs.map(doc => doc.data());
  },

  // Get a board by id if user is a member
  async getBoardById(id: string, userId: string) {
    const boardRef = db.collection('boards').doc(id);
    const boardSnap = await boardRef.get();
    if (!boardSnap.exists) throw { status: 404, message: 'Board not found' };
    const board = boardSnap.data();
    if (!board || !board.members.includes(userId))
      throw { status: 403, message: 'Permission denied' };
    return board;
  },

  // Update board if user is the owner
  async updateBoard(id: string, userId: string, { name, description }: { name?: string; description?: string }) {
    const boardRef = db.collection('boards').doc(id);
    const boardSnap = await boardRef.get();
    if (!boardSnap.exists) throw { status: 404, message: 'Board not found' };
    const board = boardSnap.data();
    if (!board || board.ownerId !== userId)
      throw { status: 403, message: 'Only the owner can update the board' };

    const updates: any = { updatedAt: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;

    await boardRef.update(updates);
    return { ...board, ...updates };
  },

  // Delete board if user is the owner
  async deleteBoard(id: string, userId: string) {
    const boardRef = db.collection('boards').doc(id);
    const boardSnap = await boardRef.get();
    if (!boardSnap.exists) throw { status: 404, message: 'Board not found' };
    const board = boardSnap.data();
    if (!board || board.ownerId !== userId)
      throw { status: 403, message: 'Only the owner can delete the board' };
    await boardRef.delete();
  }
};