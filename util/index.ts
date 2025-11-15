import { HttpException, HttpStatus } from '@nestjs/common';

export interface IValidateError {
  logMsg: string;
  returnMsg: string;
}

export const getValidateError = (
  params: Record<string, any>,
  message: string,
) => {
  throw new HttpException(
    { logMsg: JSON.stringify({ ...params, message }), returnMsg: message },
    HttpStatus.BAD_REQUEST,
  );
};
