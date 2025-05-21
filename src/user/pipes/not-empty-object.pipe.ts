import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NotEmptyObjectPipe implements PipeTransform {
  transform(value: any) {
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException('请求体不能为空');
    }
    return value;
  }
}
