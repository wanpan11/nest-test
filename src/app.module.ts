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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot(WINSTON_DEFAULT_OPTIONS),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWD'),
        database: configService.get('DB_DATABASE'),
        synchronize: true,
        logging: true,
        entities: [User, Role, Permission],
        poolSize: 10,
        connectorPackage: 'mysql2',
      }),
      inject: [ConfigService],
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
