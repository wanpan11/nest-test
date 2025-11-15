import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { BookModule } from './book/book.module';
import {
  WinstonModule,
  WINSTON_DEFAULT_OPTIONS,
} from './winston/winston.module';

@Module({
  imports: [
    WinstonModule.forRoot(WINSTON_DEFAULT_OPTIONS),
    UserModule,
    DbModule,
    BookModule,
    WinstonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
