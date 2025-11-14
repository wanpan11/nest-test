import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RegisterUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private manager: EntityManager;

  async login(loginUserDto: RegisterUserDto) {
    const user = await this.manager.findOne(User, {
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

  async create(createUserDto: RegisterUserDto) {
    const user: RegisterUserDto = {
      username: createUserDto.username,
      password: createUserDto.password,
    };

    const exist = await this.manager.findOne(User, {
      where: { username: user.username },
    });

    if (exist) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    return this.manager.save(User, user);
  }

  findAll() {
    return this.manager.find(User);
  }

  findOne(id: number) {
    return this.manager.findOne(User, {
      where: { id },
    });
  }

  update(updateUserDto: UpdateUserDto) {
    return this.manager.save(User, updateUserDto);
  }

  remove(id: number) {
    return this.manager.delete(User, id);
  }
}
