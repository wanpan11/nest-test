import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import {
  WinstonModule,
  WINSTON_DEFAULT_OPTIONS,
} from './winston/winston.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    WinstonModule.forRoot(WINSTON_DEFAULT_OPTIONS),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'wanpan',
      database: 'typeorm_test',
      synchronize: true,
      logging: true,
      entities: [User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    UserModule,
    WinstonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
