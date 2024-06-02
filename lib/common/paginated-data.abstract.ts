import { Model } from 'sequelize-typescript';
import { MetaInterface } from '../interfaces';

export abstract class PaginatedDataAbstract<M extends Model> {
  constructor(
    public readonly meta: MetaInterface,
    public readonly items: M[],
  ) {}
}
