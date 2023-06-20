import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'items',
})
export class ItemEntity extends Model {
  @Column({
    field: 'name',
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    field: 'description',
    type: DataType.STRING,
  })
  description!: string;
}
