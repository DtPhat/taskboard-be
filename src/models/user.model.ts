export interface User {
  id: string;
  email: string;
  verificationCode?: string;
  verified?: boolean;
  createdAt: string;
}