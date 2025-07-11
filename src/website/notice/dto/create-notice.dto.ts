import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeDto {
  @ApiProperty({ description: '这是 aaa' })
  @IsNotEmpty({ message: 'aaa 必填' })
  @IsString()
  readonly aaa: string;

  @ApiProperty({ description: '这是 bbb' })
  @IsString()
  readonly bbb?: string;

  @ApiProperty({ description: '这是 ccc' })
  @IsNotEmpty({ message: 'ccc 必填' })
  @IsNumber()
  readonly ccc: number;
}
