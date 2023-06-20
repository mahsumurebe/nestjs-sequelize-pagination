import { Inject, Injectable } from '@nestjs/common';
import { PAGINATION_MODULE_OPTIONS } from './pagination.constants';
import {
  MetaInterface,
  PaginationModuleOptions,
  PaginationOptions,
} from './interfaces';
import { FindAndCountOptions } from 'sequelize';
import { ModelStatic } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';
import Model from 'sequelize/types/model';
import { PaginatedData } from './common';

@Injectable()
export class PaginationService {
  constructor(
    @Inject(PAGINATION_MODULE_OPTIONS)
    private options: PaginationModuleOptions,
    private readonly sequelize: Sequelize,
  ) {}

  async findAllPaginate<M extends Model>(
    model: ModelStatic<M>,
    options: Partial<PaginationOptions>,
    optionsSequelize: FindAndCountOptions<M> = {},
  ): Promise<any> {
    const modelName = model.name;

    if (!(modelName in this.sequelize.models)) {
      throw new Error('test');
    }

    const mergedOptions: PaginationOptions = Object.assign(
      {
        path: null,
      },
      this.options,
      options,
    );

    const isComplete = mergedOptions.details === 'complete';
    const end = mergedOptions.page * mergedOptions.offset;
    const start = end - mergedOptions.offset;
    const itemCount = mergedOptions.offset;

    // Data variables
    const modelEntity = this.sequelize.models[modelName];

    const data = await modelEntity.findAndCountAll({
      ...optionsSequelize,
      limit: itemCount,
      offset: start,
    });

    const totalItemCount = data.count;
    const totalPages =
      totalItemCount > 0 ? Math.ceil(totalItemCount / itemCount) : 0;

    let aux = mergedOptions.page + 1;
    const nextPageNumber = aux <= totalPages ? aux : null;
    aux = mergedOptions.page - 1;
    const prevPageNumber = aux >= 1 ? aux : null;

    const url = new URL(mergedOptions.url);
    if (mergedOptions.path) {
      url.pathname = mergedOptions.path;
    }

    url.searchParams.set('page', mergedOptions.page.toString());

    if (isComplete) {
      url.searchParams.set('offset', mergedOptions.offset.toString());
    }

    let nextPageUrl: URL | null = null;
    if (nextPageNumber) {
      nextPageUrl = new URL(url.toString());
      nextPageUrl.searchParams.set('page', nextPageNumber.toString());
    }

    let prevPageUrl: URL | null = null;
    if (prevPageNumber) {
      prevPageUrl = new URL(url.toString());
      prevPageUrl.searchParams.set('page', prevPageNumber.toString());
    }

    let meta: MetaInterface = {
      page: mergedOptions.page,
      nextPage: nextPageNumber,
      prevPage: prevPageNumber,
    };

    if (isComplete) {
      const firstUrl = new URL(url.toString());
      firstUrl.searchParams.set('page', '1');
      let lastUrl = firstUrl;
      if (totalPages > 0) {
        lastUrl = new URL(url.toString());
        lastUrl.searchParams.set('page', totalPages.toString());
      }
      meta = {
        ...meta,
        offset: mergedOptions.offset,
        totalItems: totalItemCount,
        totalPages: totalPages,
        itemCount: itemCount,
        links: {
          firstUrl,
          lastUrl,
          nextUrl: nextPageUrl,
          prevUrl: prevPageUrl,
        },
      };
    }

    return new PaginatedData(meta, data.rows);
  }
}
