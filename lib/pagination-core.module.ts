import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  PaginationModuleAsyncOptions,
  PaginationModuleOptions,
} from './interfaces';
import { PAGINATION_MODULE_OPTIONS } from './pagination.constants';
import { PaginationService } from './pagination.service';
import { createPaginationAsyncOptions } from './common';

@Module({})
export class PaginationCoreModule {
  static forRoot(options: PaginationModuleOptions = {}): DynamicModule {
    const paginationModuleOptions: Provider = {
      provide: PAGINATION_MODULE_OPTIONS,
      useValue: options,
    };

    return {
      global: options.isGlobal,
      module: PaginationCoreModule,
      providers: [PaginationService, paginationModuleOptions],
      exports: [PaginationService],
    };
  }

  static forRootAsync(options: PaginationModuleAsyncOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: PaginationCoreModule,
      imports: options.imports,
      providers: [PaginationService, createPaginationAsyncOptions(options)],
      exports: [PaginationService],
    };
  }
}
