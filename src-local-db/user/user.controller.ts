import { Controller, Post, Body, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { WINSTON_LOGGER_TOKEN } from 'src/winston/winston.module';
import { MyLogger } from 'src/winston/MyLogger';

@Controller('user')
export class UserController {
  @Inject(WINSTON_LOGGER_TOKEN)
  private logger: MyLogger;

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    this.logger.log('login', UserController.name);
    return this.userService.login(loginUserDto);
  }
}
