export interface TaskInvite {
  invite_id: string;
  boardId: string;
  cardId: string;
  taskId: string;
  task_owner_id: string;
  member_id: string;
  email_member?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  type: 'task';
}