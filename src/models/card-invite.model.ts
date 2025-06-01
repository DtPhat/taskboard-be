export interface CardInvite {
  invite_id: string;
  boardId: string;
  cardId: string;
  card_owner_id: string;
  member_id: string;
  email_member?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  type: 'card';
}