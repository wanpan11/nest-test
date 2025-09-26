import { Module } from '@nestjs/common';

import { WeChatController } from './we-chat.controller';
import { WeChatService } from './we-chat.service';

@Module({
  controllers: [WeChatController],
  providers: [WeChatService],
})
export class WeChatModule {}
