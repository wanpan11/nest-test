import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';
import { WINSTON_LOGGER_TOKEN } from 'src/winston/winston.module';
import { MyLogger } from 'src/winston/MyLogger';
import { getValidateError } from 'util/index';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(WINSTON_LOGGER_TOKEN)
  private logger: MyLogger;

  async login(loginUserDto: RegisterUserDto) {
    const user = await this.userRepository.findOne({
      where: { username: loginUserDto.username },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      getValidateError(user, '验证码已失效');
    }
    if (user.captcha !== captcha) {
      getValidateError(user, '验证码不正确');
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      getValidateError(user, '用户已存在');
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = user.password;
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error((e as Error).message, 'UserService');
      return '注册失败';
    }
  }
}
