import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class NotEmptyObjectPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException('请求体不能为空');
    }
    return value;
  }
}
