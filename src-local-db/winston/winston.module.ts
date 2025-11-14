import { Global, Module } from '@nestjs/common';
import { MyLogger } from './MyLogger';
import { format, LoggerOptions, transports } from 'winston';
import chalk from 'chalk';

export const WINSTON_DEFAULT_OPTIONS: LoggerOptions = {
  level: 'debug',
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ context, level, message, time }) => {
          const appStr = chalk.green(`[NEST]`);
          const contextStr = chalk.yellow(`[${context as string}]`);

          return `${appStr} ${time as string} ${level} ${contextStr} ${message as string} `;
        }),
      ),
    }),
    new transports.File({
      format: format.combine(format.timestamp(), format.json()),
      filename: '111.log',
      dirname: 'log',
    }),
  ],
};
export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

@Global()
@Module({})
export class WinstonModule {
  public static forRoot(options: LoggerOptions) {
    return {
      module: WinstonModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new MyLogger(options),
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }
}
