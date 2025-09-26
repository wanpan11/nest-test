import { Module } from '@nestjs/common';

// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import envConfig from '../config/env';
import { ApiModule } from './api-test/api.module';
// import { UserEntity } from './user/entities/user.entity';
// import { UserModule } from './user/user.module';
// import { websiteModule } from './website/website.module';
import { WeChatModule } from './we-chat/we-chat.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true, // 设置为全局
    //   envFilePath: [envConfig.path],
    // }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     type: 'mysql',
    //     host: configService.get('DB_HOST'),
    //     port: configService.get<number>('DB_PORT'),
    //     username: configService.get('DB_USER'),
    //     password: configService.get('DB_PASSWD'),
    //     database: configService.get('DB_DATABASE'),
    //     entities: [UserEntity],
    //     synchronize: true,
    //   }),
    // }),
    // UserModule,
    // websiteModule,
    ApiModule,
    WeChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
