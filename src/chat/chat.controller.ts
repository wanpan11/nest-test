import { Controller, Get } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly chatService: ChatService,
  ) {}

  @Get('status')
  getStatus() {
    const connectedUsers = this.chatService.getAllUsers();
    const onlineCount = connectedUsers.filter(user => user.status === 'online').length;

    return {
      status: 'ok',
      data: {
        userCount: connectedUsers.length,
        onlineCount,
        serviceUserCount: this.chatService.getServiceUserList().length,
      },
    };
  }
}
