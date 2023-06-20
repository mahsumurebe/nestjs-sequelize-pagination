import { MetaInterface } from '../interfaces';
import { Model } from 'sequelize-typescript';

export class PaginatedData<M extends Model> {
  constructor(
    public readonly meta: MetaInterface,
    public readonly items: M[],
  ) {}

  toJSON() {
    return {
      items: this.items,
      meta: this.meta,
    };
  }
}
