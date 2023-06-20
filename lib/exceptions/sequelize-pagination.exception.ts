export class SequelizePaginationException extends Error {
  constructor(message = 'Sequelize pagination error') {
    super(message);
  }
}
