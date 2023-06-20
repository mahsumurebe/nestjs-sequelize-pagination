import {
  PaginationModuleAsyncOptions,
  PaginationModuleOptions,
} from '../interfaces';
import { PAGINATION_MODULE_OPTIONS } from '../pagination.constants';
import { Provider } from '@nestjs/common';

export const createPaginationAsyncOptions = (
  options: PaginationModuleAsyncOptions,
) =>
  ({
    provide: PAGINATION_MODULE_OPTIONS,
    useExisting: options.useExisting,
    useFactory: options.useFactory,
    useClass: options.useClass,
    inject: options.inject,
  } as Provider<PaginationModuleOptions>);
