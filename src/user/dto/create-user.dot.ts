import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名必填' })
  readonly name: string;

  @ApiProperty({ description: '年龄' })
  @IsNotEmpty({ message: '缺少年龄' })
  readonly age: number;

  @ApiProperty({ description: '性别' })
  readonly gender: 'm' | 'f';
}
