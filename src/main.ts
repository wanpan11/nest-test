import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { WINSTON_LOGGER_TOKEN } from './winston/winston.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  app.enableCors(); // 全局允许跨域
  app.setGlobalPrefix('api'); // 设置全局前缀
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // 全局管道
  app.useStaticAssets(join(__dirname, '../uploads'), { prefix: '/uploads' }); // 静态资源

  await app.listen(3000);
}
void bootstrap();
