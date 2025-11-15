import { Module } from '@nestjs/common';

import { WeChatModule } from './we-chat/we-chat.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, WeChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
