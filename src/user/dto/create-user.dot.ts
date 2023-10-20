import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  readonly name: string;

  @ApiProperty({ description: '年龄' })
  readonly age: number;

  @ApiProperty({ description: '性别' })
  readonly gender: 'm' | 'f';
}
