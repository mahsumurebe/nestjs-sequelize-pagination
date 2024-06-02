import { Inject, Injectable } from '@nestjs/common';
import { PAGINATION_MODULE_OPTIONS } from './pagination.constants';
import {
  MetaInterface,
  MetaLinksInterface,
  PaginationModuleOptions,
  PaginationOptions,
} from './interfaces';
import { FindAndCountOptions, ModelStatic } from 'sequelize';
import { Model, Sequelize } from 'sequelize-typescript';
import { mergeDeep, PaginatedData, PaginatedDataAbstract } from './common';
import { ModelDoesNotRegisteredException } from './exceptions';

@Injectable()
export class PaginationService {
  constructor(
    @Inject(PAGINATION_MODULE_OPTIONS)
    private readonly options: PaginationModuleOptions,
    private readonly sequelize: Sequelize,
  ) {}

  async findAllPaginate<M extends Model>(
    model: ModelStatic<M>,
    options: Partial<PaginationOptions<M>> = {},
    optionsSequelize: FindAndCountOptions<M> = {},
  ): Promise<PaginatedDataAbstract<M>> {
    const modelName = model.name;

    if (!this.sequelize.models[modelName]) {
      throw new ModelDoesNotRegisteredException(modelName);
    }

    const mergedOptions: PaginationOptions<M> = mergeDeep<PaginationOptions<M>>(
      {
        path: null,
        withDetails: true,
        limit: 50,
        page: 1,
        cls: PaginatedData,
      },
      this.options,
      options,
    );

    const { page, limit, url, path, withDetails } = mergedOptions;
    const offset = (page - 1) * limit;

    const data = await model.findAndCountAll({
      ...optionsSequelize,
      limit,
      offset,
    });

    const totalItemCount = data.count;
    const totalPages =
      totalItemCount > 0 ? Math.ceil(totalItemCount / limit) : 0;
    const nextPageNumber = page < totalPages ? page + 1 : null;
    const prevPageNumber = page > 1 ? page - 1 : null;

    let meta: MetaInterface = {
      pageCount: totalPages,
      page,
      nextPage: nextPageNumber,
      prevPage: prevPageNumber,
    };

    if (withDetails) {
      const links = url
        ? this.createMetaLinks(
            url,
            path,
            page,
            limit,
            totalPages,
            nextPageNumber,
            prevPageNumber,
          )
        : undefined;
      meta = {
        ...meta,
        limit,
        totalItems: totalItemCount,
        itemCount: data.rows.length,
        links,
      };
    }

    return new mergedOptions.cls!(meta, data.rows);
  }

  private createMetaLinks(
    baseUrl: string,
    path: string | null | undefined,
    page: number,
    limit: number,
    totalPages: number,
    nextPageNumber: number | null,
    prevPageNumber: number | null,
  ): MetaLinksInterface {
    const selfUrl = new URL(baseUrl);

    if (path) {
      selfUrl.pathname = `${selfUrl.pathname.replace(/\/+$/g, '')}/${path.replace(/^\/+/g, '')}`;
    }

    const createPageUrl = (pageNumber: number): URL => {
      const pageUrl = new URL(selfUrl.toString());
      pageUrl.searchParams.set('page', pageNumber.toString());
      pageUrl.searchParams.set('limit', limit.toString());
      return pageUrl;
    };

    selfUrl.searchParams.set('page', page.toString());
    selfUrl.searchParams.set('limit', limit.toString());

    const nextPageUrl = nextPageNumber ? createPageUrl(nextPageNumber) : null;
    const prevPageUrl = prevPageNumber ? createPageUrl(prevPageNumber) : null;
    const firstPageUrl = createPageUrl(1);
    const lastPageUrl =
      totalPages > 0 ? createPageUrl(totalPages) : firstPageUrl;

    return {
      self: selfUrl,
      first: firstPageUrl,
      last: lastPageUrl,
      next: nextPageUrl,
      previous: prevPageUrl,
    };
  }
}
