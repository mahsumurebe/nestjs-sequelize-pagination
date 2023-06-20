import { MetaInterface } from '../interfaces';
import { ModelStatic } from 'sequelize/types';

export class PaginatedData<T = ModelStatic<any>> {
  constructor(public readonly meta: MetaInterface, public readonly items: T) {}

  toJSON() {
    return {
      items: this.items,
      meta: this.meta,
    };
  }
}
