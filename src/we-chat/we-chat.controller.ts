import { Body, Controller, Post } from '@nestjs/common';

import { WxTokenRequest } from './interface';
import { WeChatService } from './we-chat.service';

@Controller('weChat')
export class WeChatController {
  constructor(private readonly weChatService: WeChatService) {}

  @Post()
  create(@Body() params: WxTokenRequest) {
    return this.weChatService.getToken(params);
  }
}
