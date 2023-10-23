import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dot';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '获取用户' })
  home() {
    return 'User Home ~';
  }

  @Post('/create')
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }
}
