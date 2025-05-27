import { RedisClientType } from 'redis';
import { Repository } from 'typeorm';

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name } = createUserDto;

    const userExist = await this.userRepository.findOne({ where: { name } });
    if (userExist) {
      throw new HttpException('用户已存在', 401);
    }

    return await this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const cache = (await this.redisClient.get(`user:${id}`)) as string;

    if (cache) {
      return JSON.parse(cache);
    } else {
      const user = await this.userRepository.findOne({ where: { id } });
      this.redisClient.set(`user:${id}`, JSON.stringify(user));
      return user;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!updateUserDto) {
      throw new HttpException('参数不能为空', 401);
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('用户不存在', 401);
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('用户不存在', 401);
    }

    return this.userRepository.delete(id);
  }
}
