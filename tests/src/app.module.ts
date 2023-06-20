import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemsModule } from './items/items.module';
import { PaginationModule } from '../../lib';

@Module({
  imports: [
    SequelizeModule.forRoot({
      database: 'postgres',
      dialect: 'postgres',
      logging: false,
      username: 'root',
      password: 'root',
      host: 'localhost',
      port: 5432,
      synchronize: true,
      autoLoadModels: true,
      retryAttempts: 2,
      retryDelay: 1000,
    }),
    ItemsModule,
    PaginationModule.forRoot({
      isGlobal: true,
      offset: 50,
      page: 1,
      details: 'complete',
      url: 'http://localhost:3001/',
    }),
  ],
})
export class ApplicationModule {}
