import { db } from '../config';
import { sendVerificationCode } from './mail.service';
import { FieldValue } from 'firebase-admin/firestore';
import { SocketService } from './socket.service';

interface InviteData {
  boardId: string;
  board_owner_id: string;
  member_id: string;
  email_member: string;
  status: string;
  invite_id?: string;
  createdAt?: string;
}

interface InviteResponse {
  success: boolean;
  invite_id?: string;
  status?: string;
}

export const InviteService = {
  async inviteToBoard({ boardId, board_owner_id, member_id, email_member, status }: InviteData): Promise<InviteResponse> {
    // Find user ID by email
    const userRef = db.collection('users').where('email', '==', email_member);
    const userSnapshot = await userRef.get();

    if (userSnapshot.empty) {
      throw new Error('User not found');
    }

    const memberId = userSnapshot.docs[0].id;

    const inviteRef = db.collection('invites').doc();
    const inviteData: InviteData = {
      invite_id: inviteRef.id,
      boardId,
      board_owner_id,
      member_id: memberId,
      email_member,
      status: status || 'pending',
      createdAt: new Date().toISOString(),
    };
    await inviteRef.set(inviteData);

    // Optionally send email
    // if (email_member) {
    //   await sendVerificationCode(
    //     email_member,
    //     `You have been invited to board. Respond in the app.`
    //   );
    // }

    // Emit real-time notification to board members
    SocketService.emitBoardInvitation(boardId, memberId, {
      invite_id: inviteRef.id,
      board_owner_id,
      email_member,
      status
    });

    return { success: true, invite_id: inviteRef.id };
  },

  async respondToInvite({ boardId, invite_id, member_id, status }: InviteData): Promise<InviteResponse> {
    if (!invite_id) {
      throw { status: 400, message: 'Invite ID is required' };
    }

    const inviteRef = db.collection('invites').doc(invite_id);
    const inviteSnap = await inviteRef.get();
    if (!inviteSnap.exists) {
      throw { status: 404, message: 'Invite not found' };
    }

    const invite = inviteSnap.data() as InviteData;

    // Validate invite
    if (!invite.boardId || invite.boardId !== boardId) {
      throw { status: 400, message: 'Board ID mismatch' };
    }
    if (!invite.member_id || invite.member_id !== member_id) {
      throw { status: 403, message: 'This invite is not for you' };
    }
    if (!status || !['accepted', 'rejected'].includes(status)) {
      throw { status: 400, message: 'Invalid status' };
    }
    if (invite.status !== 'pending') {
      throw { status: 400, message: 'Invite has already been responded to' };
    }

    await inviteRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp()
    });

    if (status === 'accepted') {
      // Add member to board's members array
      const boardRef = db.collection('boards').doc(boardId);
      await boardRef.update({
        members: FieldValue.arrayUnion(member_id),
      });

      // Emit real-time notification for board join
      SocketService.emitBoardJoin(boardId, member_id, {
        name: invite.email_member,
        email: invite.email_member
      });
    }

    return { success: true, status };
  }
};
