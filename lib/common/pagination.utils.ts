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
  }) as Provider<PaginationModuleOptions>;

export function mergeDeep<T extends { [key: string]: any }>(
  target: T,
  ...sources: Array<Partial<T> | { [key: string]: any }>
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          (<any>target)[key] = {} as any;
        }
        mergeDeep(target[key], (<any>source)[key]);
      } else if (source[key] !== undefined && source[key] !== null) {
        (<any>target)[key] = source[key];
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}
