import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { UserModule } from './user/user.module';
import {
  WinstonModule,
  WINSTON_DEFAULT_OPTIONS,
} from './winston/winston.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './redis/redis.module';
import { TransformInterceptor } from './core/transform.interceptor';
import { HttpFilterModule } from './core/httpException';

@Module({
  imports: [
    WinstonModule.forRoot(WINSTON_DEFAULT_OPTIONS),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'wanpan',
      database: 'public',
      synchronize: true,
      logging: true,
      entities: [User, Role, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
    }),
    RedisModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor, // 全局响应拦截器
    },
    {
      provide: APP_FILTER,
      useClass: HttpFilterModule, // 全局异常过滤器
    },
  ],
})
export class AppModule {}
