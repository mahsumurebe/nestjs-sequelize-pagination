import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemsModule } from './items/items.module';
import { PaginationModule } from '../../lib';
import * as SQLite from 'sqlite3';

@Module({
  imports: [
    SequelizeModule.forRoot({
      logging: false,
      synchronize: true,
      autoLoadModels: true,
      retryAttempts: 2,
      retryDelay: 1000,
      dialect: 'sqlite',
      storage: 'tests/db.sqlite',
      dialectOptions: {
        mode:
          SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
      },
    }),
    ItemsModule,
    PaginationModule.forRoot({
      isGlobal: true,
      offset: 50,
      page: 1,
      details: true,
      url: 'http://localhost:3001/',
    }),
  ],
})
export class ApplicationModule {}
