import { Injectable } from '@nestjs/common';
import { ItemEntity } from './item.entity';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationOptions, PaginationService } from '../../../lib';
import { FindAndCountOptions } from 'sequelize';

@Injectable()
export class ItemService {
  constructor(
    private readonly paginationService: PaginationService,
    @InjectModel(ItemEntity)
    private readonly itemRepository: typeof ItemEntity,
  ) {}

  findAll(
    options: PaginationOptions,
    optionsSequelize: FindAndCountOptions<ItemEntity> = {},
  ) {
    return this.paginationService.findAllPaginate(
      this.itemRepository,
      options,
      optionsSequelize,
    );
  }

  async create(): Promise<ItemEntity[]> {
    await this.itemRepository.truncate({ restartIdentity: true });
    const records = [];
    for (let i = 0; i < 100; i++) {
      records.push({
        name: `Pagination ${i}`,
        description: 'Pagination test !',
      });
    }
    return this.itemRepository.bulkCreate(records);
  }
}
