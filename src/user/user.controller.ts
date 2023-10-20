import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dot';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  home() {
    return 'User Home ~';
  }

  @ApiOperation({ summary: '创建用户' })
  @Post('/create')
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }
}
