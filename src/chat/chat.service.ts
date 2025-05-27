import { Injectable } from '@nestjs/common';

import { ChatMessage, UserStatus } from './message.interface';

@Injectable()
export class ChatService {
  private connectedUsers: Map<string, UserStatus> = new Map();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId
  private messages: ChatMessage[] = [];

  addUser(userId: string, socketId: string, userData: Partial<UserStatus>): void {
    const user: UserStatus = {
      id: userId,
      name: userData.name || `用户${userId}`,
      status: 'online',
      unreadCount: 0,
      type: userData.type || 'user',
      ...userData,
    };
    this.connectedUsers.set(userId, user);
    this.userSockets.set(userId, socketId);
  }

  removeUser(userId: string): void {
    this.connectedUsers.delete(userId);
    this.userSockets.delete(userId);
  }

  getUserBySocketId(socketId: string): string | undefined {
    for (const [userId, sid] of this.userSockets.entries()) {
      if (sid === socketId) return userId;
    }
    return undefined;
  }

  getSocketId(userId: string): string | undefined {
    return this.userSockets.get(userId);
  }

  getAllUsers(): UserStatus[] {
    return Array.from(this.connectedUsers.values());
  }

  getUser(userId: string): UserStatus | undefined {
    return this.connectedUsers.get(userId);
  }

  updateUserStatus(userId: string, status: Partial<UserStatus>): void {
    const currentUser = this.connectedUsers.get(userId);
    if (currentUser) {
      this.connectedUsers.set(userId, { ...currentUser, ...status });
    }
  }

  addMessage(message: ChatMessage): void {
    this.messages.push(message);
    // 更新用户最后一条消息
    const user = this.connectedUsers.get(message.toUserId);
    if (user) {
      this.updateUserStatus(message.toUserId, {
        lastMessage: message.content,
        unreadCount: user.unreadCount + 1,
      });
    }
  }

  getMessages(userId: string): ChatMessage[] {
    return this.messages.filter(msg => msg.fromUserId === userId || msg.toUserId === userId);
  }

  clearUnreadCount(userId: string): void {
    const user = this.connectedUsers.get(userId);
    if (user) {
      this.updateUserStatus(userId, { unreadCount: 0 });
    }
  }

  // 获取客服人员的待处理用户列表
  getServiceUserList(): UserStatus[] {
    return this.getAllUsers().filter(user => user.type !== 'service');
  }
}
