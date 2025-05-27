export interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
  fromUserId: string;
  toUserId: string;
  type: 'user' | 'service';
}

export interface UserStatus {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastMessage?: string;
  unreadCount: number;
  type: 'user' | 'service';
}
