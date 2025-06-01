import { db } from '../config';
import { sendVerificationCode } from './mail.service';
import { FieldValue } from 'firebase-admin/firestore';

export const InviteService = {
  async inviteToBoard({ boardId, board_owner_id, member_id, email_member, status }: any) {
    // status should be 'pending' on creation
    const inviteRef = db.collection('invites').doc();
    const inviteData = {
      invite_id: inviteRef.id,
      boardId,
      board_owner_id,
      member_id,
      email_member,
      status: status || 'pending',
      createdAt: new Date().toISOString(),
    };
    await inviteRef.set(inviteData);

    // Optionally send email
    if (email_member) {
      await sendVerificationCode(
        email_member,
        `You have been invited to board. Respond in the app.`
      );
    }

    return { success: true, invite_id: inviteRef.id };
  },

  async respondToInvite({ boardId, inviteId, member_id, status }: any) {
    const inviteRef = db.collection('invites').doc(inviteId);
    const inviteSnap = await inviteRef.get();
    if (!inviteSnap.exists) throw { status: 404, message: 'Invite not found' };
    await inviteRef.update({ status });

    if (status === 'accepted') {
      // Add member to board's members array
      const boardRef = db.collection('boards').doc(boardId);
      await boardRef.update({
        members: FieldValue.arrayUnion(member_id),
      });
    }
    // No action needed for declined
  },
};