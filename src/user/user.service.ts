import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

export interface PostsRo {
  list: UserEntity[];
  count: number;
}
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const { name } = user;

    if (!name) {
      throw new HttpException('缺少姓名', 401);
    }

    const userExist = await this.userRepository.findOne({ where: { name } });

    if (userExist) {
      throw new HttpException('用户已存在', 401);
    }

    return await this.userRepository.save(user);
  }
}
