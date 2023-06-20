import { SequelizePaginationException } from './sequelize-pagination.exception';

export class ModelDoesNotRegisteredException extends SequelizePaginationException {
  constructor(public readonly modelName: string) {
    super('Model does not registered');
  }
}
