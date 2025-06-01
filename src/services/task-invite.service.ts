import { db } from '../config';
import { sendVerificationCode } from './mail.service';
import { FieldValue } from 'firebase-admin/firestore';

export const TaskInviteService = {
  async inviteToTask({ boardId, cardId, taskId, task_owner_id, member_id, email_member, status }: any) {
    const inviteRef = db.collection('invites').doc();
    const inviteData = {
      invite_id: inviteRef.id,
      boardId,
      cardId,
      taskId,
      task_owner_id,
      member_id,
      email_member,
      status: status || 'pending',
      createdAt: new Date().toISOString(),
      type: 'task'
    };
    await inviteRef.set(inviteData);

    if (email_member) {
      await sendVerificationCode(
        email_member,
        `You have been invited to a task. Respond in the app.`
      );
    }

    return { success: true, invite_id: inviteRef.id };
  },

  async respondToInvite({ boardId, cardId, taskId, inviteId, member_id, status }: any) {
    const inviteRef = db.collection('invites').doc(inviteId);
    const inviteSnap = await inviteRef.get();
    if (!inviteSnap.exists) throw { status: 404, message: 'Invite not found' };
    await inviteRef.update({ status });

    if (status === 'accepted') {
      // Add member to task's assignedMembers array
      const taskRef = db.collection('boards').doc(boardId)
        .collection('cards').doc(cardId)
        .collection('tasks').doc(taskId);
      await taskRef.update({
        assignedMembers: FieldValue.arrayUnion(member_id),
      });
    }
    // No action needed for declined
  },
};