import { Model } from 'sequelize-typescript';
import { MetaInterface } from '../interfaces';
import { PaginatedDataAbstract } from './paginated-data.abstract';

export interface PaginationMetaObject<M extends Model> {
  items: M['toJSON'][];
  meta: MetaInterface;
}

export class PaginatedData<M extends Model> extends PaginatedDataAbstract<M> {
  toJSON(): PaginationMetaObject<M> {
    return {
      items: this.items.map((item) => item.toJSON()),
      meta: this.meta,
    };
  }
}
