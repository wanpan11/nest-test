import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { VALIDATE_ERROR_CODE } from 'common/index.';
import { MyLogger } from 'src/winston/MyLogger';
import { WINSTON_LOGGER_TOKEN } from 'src/winston/winston.module';
import { IValidateError } from 'util/index';

@Catch(HttpException)
@Injectable()
export class HttpFilterModule implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_LOGGER_TOKEN) private readonly logger: MyLogger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse(); // 获取请求上下文中的 response对象

    const status = exception.getStatus(); // 获取异常状态码
    const errorResponse = exception.getResponse(); // 获取异常响应体

    let returnMsg = '';
    let logMsg = '';
    if (typeof errorResponse === 'object') {
      if ('logMsg' in errorResponse && 'returnMsg' in errorResponse) {
        returnMsg = (errorResponse as IValidateError).returnMsg;
        logMsg = (errorResponse as IValidateError).logMsg;
      } else {
        returnMsg = JSON.stringify(errorResponse);
        logMsg = JSON.stringify(errorResponse);
      }
    } else {
      returnMsg = errorResponse;
      logMsg = errorResponse;
    }

    this.logger.error(logMsg, HttpFilterModule.name);

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(200);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send({
      data: null,
      message: returnMsg,
      code: status == 400 ? VALIDATE_ERROR_CODE : status,
    });
  }
}
