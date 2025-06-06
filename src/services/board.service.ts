import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config';
import { InviteService } from './invite.service';

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

    const boards = await Promise.all(boardsSnap.docs.map(async (doc) => {
      const board = doc.data();
      const members = await Promise.all(board.members.map(async (memberId: string) => {
        const memberDoc = await db.collection('users').doc(memberId).get();
        if (!memberDoc.exists) return null;
        const memberData = memberDoc.data();
        return {
          id: memberId,
          ...memberData
        };
      }));

      return {
        id: doc.id,
        ...board,
        members: members.filter((m): m is typeof members[0] => m !== null)
      };
    }));

    return boards;
  },

  // Get a board by id if user is a member
  async getBoardById(id: string, userId: string) {
    const boardRef = db.collection('boards').doc(id);
    const boardSnap = await boardRef.get();
    if (!boardSnap.exists) throw { status: 404, message: 'Board not found' };
    const board = boardSnap.data();
    if (!board || !board.members.includes(userId))
      throw { status: 403, message: 'Permission denied' };

    // Fetch and include member information
    const members = await Promise.all(board.members.map(async (memberId: string) => {
      const memberDoc = await db.collection('users').doc(memberId).get();
      if (!memberDoc.exists) return null;
      const memberData = memberDoc.data();
      return {
        id: memberId,
        ...memberData
      };
    }));

    return {
      id: boardSnap.id,
      ...board,
      members: members.filter((m): m is typeof members[0] => m !== null)
    };
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
  },

  // Accept board invitation
  async acceptInvite(boardId: string, userId: string, inviteId: string) {
    // First check if user is already a member
    const boardRef = db.collection('boards').doc(boardId);
    const boardSnap = await boardRef.get();
    if (!boardSnap.exists) throw { status: 404, message: 'Board not found' };
    const board = boardSnap.data();
    if (!board) {
      throw { status: 404, message: 'Board data not found' };
    }

    if (board.members.includes(userId)) {
      throw { status: 400, message: 'You are already a member of this board' };
    }

    // Accept the invite through InviteService
    await InviteService.respondToInvite({
      boardId,
      inviteId,
      member_id: userId,
      status: 'accepted'
    });

    // Update board members
    await boardRef.update({
      members: FieldValue.arrayUnion(userId),
      updatedAt: new Date().toISOString()
    });

    // Return updated board data with member info
    const updatedBoardSnap = await boardRef.get();
    const updatedBoard = updatedBoardSnap.data();
    if (!updatedBoard) {
      throw { status: 404, message: 'Updated board data not found' };
    }

    const members = await Promise.all(updatedBoard.members.map(async (memberId: string) => {
      const memberDoc = await db.collection('users').doc(memberId).get();
      if (!memberDoc.exists) return null;
      const memberData = memberDoc.data();
      return {
        id: memberId,
        ...memberData
      };
    }));

    return {
      id: updatedBoardSnap.id,
      ...updatedBoard,
      members: members.filter((m): m is typeof members[0] => m !== null)
    };
  }
}