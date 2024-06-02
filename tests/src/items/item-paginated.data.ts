import { PaginatedDataAbstract } from '../../../lib';
import { Model } from 'sequelize-typescript';

export class ItemPaginatedData<
  M extends Model = any,
> extends PaginatedDataAbstract<M> {
  toJSON() {
    return {
      itemsList: this.items.map((item) => item.toJSON()),
      metaData: this.meta,
    };
  }
}
