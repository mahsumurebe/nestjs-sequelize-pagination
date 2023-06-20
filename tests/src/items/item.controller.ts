import { Controller, Get, Post } from '@nestjs/common';
import { ItemEntity } from './item.entity';
import { ItemService } from './item.service';
import { PaginateQuery, PaginationOptions } from '../../../lib';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('/')
  findAll(
    @PaginateQuery() paginateQuery: PaginationOptions,
  ): Promise<ItemEntity[]> {
    return this.itemService.findAll(paginateQuery);
  }

  @Post('/')
  create(): Promise<ItemEntity[]> {
    return this.itemService.create();
  }
}
