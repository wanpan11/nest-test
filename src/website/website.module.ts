import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoticeEntity } from './notice/entities/notice.entity';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWD'),
        database: configService.get('DB_DATABASE'),
        entities: [NoticeEntity],
        synchronize: true,
      }),
    }),
    NoticeModule,
  ],
  controllers: [],
  providers: [],
})
export class websiteModule {}
