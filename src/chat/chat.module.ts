import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatGateway, RootGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, RootGateway, ChatService],
})
export class ChatModule {}
