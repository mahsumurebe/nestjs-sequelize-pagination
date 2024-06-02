import { Controller, Get, Post } from '@nestjs/common';
import { PaginationOptions, PaginationQuery } from '../../../lib';
import { ItemEntity } from './item.entity';
import { ItemService } from './item.service';
import { ItemPaginatedData } from './item-paginated.data';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('/')
  findAll(@PaginationQuery() paginateQuery: PaginationOptions) {
    return this.itemService.findAll(paginateQuery);
  }

  @Get('/diff-cls')
  findAllDiffCls(@PaginationQuery() paginateQuery: PaginationOptions) {
    return this.itemService.findAll({
      ...paginateQuery,
      cls: ItemPaginatedData,
    });
  }

  @Post('/')
  create(): Promise<ItemEntity[]> {
    return this.itemService.create();
  }
}
