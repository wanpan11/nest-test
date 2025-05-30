import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotEmptyObjectPipe } from './pipes/not-empty-object.pipe';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('select/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post('update/:id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe, NotEmptyObjectPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Get('del/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
