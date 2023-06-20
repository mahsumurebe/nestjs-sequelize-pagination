import { SequelizePaginationException } from './sequelize-pagination.exception';

export class OnlyHttpContextException extends SequelizePaginationException {
  constructor() {
    super('Only http application context is supported');
  }
}
