import { Inject, Injectable } from '@nestjs/common';
import { PAGINATION_MODULE_OPTIONS } from './pagination.constants';
import {
  MetaInterface,
  PaginationModuleOptions,
  PaginationOptions,
} from './interfaces';
import { FindAndCountOptions } from 'sequelize';
import { Model, ModelType, Sequelize } from 'sequelize-typescript';
import { PaginatedData } from './common';
import { ModelDoesNotRegisteredException } from './exceptions';

@Injectable()
export class PaginationService {
  constructor(
    @Inject(PAGINATION_MODULE_OPTIONS)
    private options: PaginationModuleOptions,
    private readonly sequelize: Sequelize,
  ) {}

  async findAllPaginate<
    A extends object,
    B extends object,
    M extends Model<A, B>,
  >(
    model: ModelType<A, B>,
    options: Partial<PaginationOptions>,
    optionsSequelize: FindAndCountOptions<M> = {},
  ): Promise<PaginatedData<M>> {
    const modelName = model.name;

    if (!(modelName in this.sequelize.models)) {
      throw new ModelDoesNotRegisteredException(modelName);
    }

    const mergedOptions: PaginationOptions = Object.assign(
      {
        path: null,
        details: true,
        offset: 50,
        page: 1,
      },
      this.options,
      options,
    );

    const end = mergedOptions.page * mergedOptions.offset;
    const start = end - mergedOptions.offset;
    const itemCount = mergedOptions.offset;

    const data = await model.findAndCountAll({
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

    let url: URL | null = null;
    let nextPageUrl: URL | null = null;
    let prevPageUrl: URL | null = null;

    if (mergedOptions.url) {
      url = new URL(mergedOptions.url);
      if (mergedOptions.path) {
        url.pathname =
          url.pathname.replace(/\/+$/g, '') +
          '/' +
          mergedOptions.path.replace(/^\/+/g, '');
      }

      url.searchParams.set('page', mergedOptions.page.toString());
      url.searchParams.set('offset', mergedOptions.offset.toString());

      if (nextPageNumber) {
        nextPageUrl = new URL(url.toString());
        nextPageUrl.searchParams.set('page', nextPageNumber.toString());
      }

      if (prevPageNumber) {
        prevPageUrl = new URL(url.toString());
        prevPageUrl.searchParams.set('page', prevPageNumber.toString());
      }
    }

    let meta: MetaInterface = {
      pageCount: totalPages,
      page: mergedOptions.page,
      nextPage: nextPageNumber,
      prevPage: prevPageNumber,
    };

    if (mergedOptions.details) {
      meta = {
        ...meta,
        offset: mergedOptions.offset,
        totalItems: totalItemCount,
        itemCount: data.rows.length,
      };
      if (url) {
        const firstUrl = new URL(url.toString());
        firstUrl.searchParams.set('page', '1');
        let lastUrl = firstUrl;
        if (totalPages > 0) {
          lastUrl = new URL(url.toString());
          lastUrl.searchParams.set('page', totalPages.toString());
        }
        meta = {
          ...meta,
          links: {
            self: url,
            first: firstUrl,
            last: lastUrl,
            next: nextPageUrl,
            previous: prevPageUrl,
          },
        };
      }
    }

    return new PaginatedData<M>(meta, data.rows as M[]);
  }
}
