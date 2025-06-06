import { db } from '../config';
import { v4 as uuidv4 } from 'uuid';
import { FieldValue } from 'firebase-admin/firestore';

export const TaskService = {
  async getAllTasks(boardId: string, cardId: string) {
    const tasksRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks');
    const snapshot = await tasksRef.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      boardId,
      cardId,
      ...doc.data()
    }));
  },

  async createTask(boardId: string, cardId: string, { title, description, status, ownerId }: any) {
    const tasksRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks');
    const data = {
      title, description, status,
      ownerId,
      assignedMembers: [],
      githubAttachments: [],
      createdAt: new Date().toISOString()
    };
    const docRef = await tasksRef.add(data);
    // Update tasks_count in card
    await db.collection('boards').doc(boardId).collection('cards').doc(cardId)
      .update({ tasks_count: FieldValue.increment(1) });
    return { id: docRef.id, ...data };
  },

  async getTaskById(boardId: string, cardId: string, taskId: string) {
    const taskDoc = await db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) throw { status: 404, message: 'Task not found' };
    return { id: taskDoc.id, ...taskDoc.data() };
  },

  async updateTask(boardId: string, cardId: string, taskId: string, { title, description, status, ownerId, newCardId }: any) {
    const taskRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();
    if (!taskDoc.exists) throw { status: 404, message: 'Task not found' };

    // If newCardId is provided and different from current cardId
    if (newCardId && newCardId !== cardId) {
      // Get the current task data
      const taskData = taskDoc.data();
      
      // Delete from current card
      await taskRef.delete();
      
      // Add to new card
      const newTaskRef = db.collection('boards').doc(boardId).collection('cards').doc(newCardId).collection('tasks').doc(taskId);
      await newTaskRef.set({
        ...taskData,
        title,
        description,
        status,
        ownerId
      });
      
      // Update tasks_count in both cards
      await db.collection('boards').doc(boardId).collection('cards').doc(cardId)
        .update({ tasks_count: FieldValue.increment(-1) });
      await db.collection('boards').doc(boardId).collection('cards').doc(newCardId)
        .update({ tasks_count: FieldValue.increment(1) });

      return {
        id: taskId,
        boardId,
        cardId: newCardId,
        title,
        description,
        status,
        ownerId
      };
    }

    // If no newCardId or same cardId, just update in place
    await taskRef.update({ title, description, status, ownerId });
    
    return {
      id: taskId,
      boardId,
      cardId,
      title,
      description,
      status,
      ownerId
    };
  },

  async deleteTask(boardId: string, cardId: string, taskId: string) {
    await db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks').doc(taskId).delete();
    // Optionally: decrement tasks_count in card
    await db.collection('boards').doc(boardId).collection('cards').doc(cardId)
      .update({ tasks_count: FieldValue.increment(-1) });
  },

  async assignMemberToTask(boardId: string, cardId: string, taskId: string, memberId: string) {
    const taskRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks').doc(taskId);
    await taskRef.update({
      assignedMembers: FieldValue.arrayUnion(memberId)
    });
  },

  async getAssignedMembers(boardId: string, cardId: string, taskId: string) {
    const taskDoc = await db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) throw { status: 404, message: 'Task not found' };
    const task = taskDoc.data();
    return (task?.assignedMembers || []).map((memberId: string) => ({ taskId, memberId }));
  },

  async removeMemberAssignment(boardId: string, cardId: string, taskId: string, memberId: string) {
    const taskRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks').doc(taskId);
    await taskRef.update({
      assignedMembers: FieldValue.arrayRemove(memberId)
    });
  },

  async attachGithubItem(boardId: string, cardId: string, taskId: string, { type, number }: any) {
    const taskRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks').doc(taskId);
    const attachmentId = uuidv4();
    const attachment = { attachmentId, type, number };
    await taskRef.update({
      githubAttachments: FieldValue.arrayUnion(attachment)
    });
    return { taskId, ...attachment };
  },

  async getGithubAttachments(boardId: string, cardId: string, taskId: string) {
    const taskDoc = await db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) throw { status: 404, message: 'Task not found' };
    return taskDoc.data()?.githubAttachments || [];
  },

  async removeGithubAttachment(boardId: string, cardId: string, taskId: string, attachmentId: string) {
    const taskRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId).collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();
    const attachments = taskDoc.data()?.githubAttachments || [];
    const filtered = attachments.filter((a: any) => a.attachmentId !== attachmentId);
    await taskRef.update({ githubAttachments: filtered });
  }
};