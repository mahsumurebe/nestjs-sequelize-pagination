import type { ModuleMetadata } from '@nestjs/common';
import type { PaginationOptions } from './pagination-options.interface';

export interface PaginationModuleOptions
  extends Partial<Omit<PaginationOptions<any>, 'path'>> {
  isGlobal?: boolean;
}

export interface PaginationModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useExisting?: Omit<PaginationModuleOptions, 'isGlobal'>;
  useClass?: Omit<PaginationModuleOptions, 'isGlobal'>;
  useFactory?: (
    ...args: any[]
  ) =>
    | Promise<Omit<PaginationModuleOptions, 'isGlobal'>>
    | Omit<PaginationModuleOptions, 'isGlobal'>;
  inject?: any[];
}
