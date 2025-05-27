import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { ChatService } from '../chat/chat.service';
import { ChatMessage } from './message.interface';

interface ConnectPayload {
  userId: string;
  name: string;
  type: 'user' | 'service';
}

@WebSocketGateway({ cors: { origin: '*' } })
export class RootGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // 处理客户端连接
  async handleConnection(client: Socket) {
    console.log(`Client connected to root namespace: ${client.id}`);
    // 断开根路径连接，强制客户端使用正确的namespace
    client.disconnect(true);
  }

  // 处理客户端断开连接
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected from root namespace: ${client.id}`);
  }
}

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // 处理客户端连接
  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // 处理客户端断开连接
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = this.chatService.getUserBySocketId(client.id);
    if (userId) {
      this.chatService.removeUser(userId);
      // 通知其他用户状态更新
      this.broadcastUserList();
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  // 处理用户注册连接
  @SubscribeMessage('register')
  async handleRegister(@ConnectedSocket() client: Socket, @MessageBody() payload: ConnectPayload) {
    this.chatService.addUser(payload.userId, client.id, {
      name: payload.name,
      type: payload.type,
    });

    // 将客户端加入到对应的房间
    await client.join(payload.userId);

    // 如果是客服人员，返回用户列表
    if (payload.type === 'service') {
      client.emit('userList', this.chatService.getServiceUserList());
    }

    // 广播用户列表更新
    this.broadcastUserList();

    return { status: 'ok', message: '注册成功' };
  }

  // 处理消息发送
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    message: { fromUserId: string; toUserId: string; content: string; type: 'user' | 'service' },
  ) {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message.content,
      timestamp: Date.now(),
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      type: message.type,
    };

    this.chatService.addMessage(newMessage);

    // 发送消息给接收者
    const receiverSocketId = this.chatService.getSocketId(message.toUserId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('message', newMessage);
    }

    // 更新用户列表（因为未读消息数可能变化）
    this.broadcastUserList();

    return { status: 'ok', message: newMessage };
  }

  // 处理已读消息
  @SubscribeMessage('readMessages')
  handleReadMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    this.chatService.clearUnreadCount(payload.userId);
    this.broadcastUserList();
    return { status: 'ok' };
  }

  // 获取历史消息
  @SubscribeMessage('getMessages')
  handleGetMessages(@ConnectedSocket() client: Socket, @MessageBody() payload: { userId: string }) {
    const messages = this.chatService.getMessages(payload.userId);
    return { status: 'ok', messages };
  }

  // 广播用户列表更新
  private broadcastUserList() {
    const userList = this.chatService.getServiceUserList();
    this.server.emit('userListUpdate', userList);
  }
}
