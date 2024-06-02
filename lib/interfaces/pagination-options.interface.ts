import { Type } from '@nestjs/common';
import { Model } from 'sequelize-typescript';
import { PaginatedDataAbstract } from '../common';

export interface PaginationOptions<M extends Model = any> {
  page: number;
  limit: number;
  path?: string | null;
  url?: string | null;
  withDetails?: boolean;
  cls?: Type<PaginatedDataAbstract<M>>;
}
