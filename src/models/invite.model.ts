export interface Invite {
  invite_id: string;
  boardId: string;
  board_owner_id: string;
  member_id: string;
  email_member?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}