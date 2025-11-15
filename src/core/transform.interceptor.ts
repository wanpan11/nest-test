import { Observable, map, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { WINSTON_LOGGER_TOKEN } from 'src/winston/winston.module';
import { MyLogger } from 'src/winston/MyLogger';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_LOGGER_TOKEN) private readonly logger: MyLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        this.logger?.log('response transformed', TransformInterceptor.name);
      }),
      map((data) => {
        return {
          data,
          code: 0,
          msg: '请求成功',
        };
      }),
    );
  }
}
