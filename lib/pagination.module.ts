import { DynamicModule, Module } from '@nestjs/common';
import { PaginationCoreModule } from './pagination-core.module';
import {
  PaginationModuleAsyncOptions,
  PaginationModuleOptions,
} from './interfaces';

@Module({})
export class PaginationModule {
  static forRoot(options?: PaginationModuleOptions): DynamicModule {
    return {
      module: PaginationModule,
      imports: [PaginationCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: PaginationModuleAsyncOptions): DynamicModule {
    return {
      module: PaginationModule,
      imports: [PaginationCoreModule.forRootAsync(options)],
    };
  }
}
