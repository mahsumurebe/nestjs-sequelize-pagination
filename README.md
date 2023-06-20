# NestJs Sequelize Pagination

Sequelize pagination module for NestJS.

<a href="https://www.npmjs.com/nestjs-sequelize-pagination" target="_blank">
<img src="https://img.shields.io/npm/v/nestjs-sequelize-pagination" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/nestjs-sequelize-pagination" target="_blank">
<img src="https://img.shields.io/npm/l/nestjs-sequelize-pagination" alt="Package License" /></a>
<a href="https://www.npmjs.com/nestjs-sequelize-pagination" target="_blank">
<img src="https://img.shields.io/npm/dm/nestjs-sequelize-pagination" alt="NPM Downloads" /></a>
<a href="https://github.com/mahsumurebe/nestjs-sequelize-pagination" target="_blank">
<img src="https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_95.svg" alt="Coverage" /></a>
<a href="https://github.com/mahsumurebe/nestjs-sequelize-pagination"><img alt="Github Page" src="https://img.shields.io/badge/Github%20Page-nestjs--sequelize--pagination-yellow?style=flat-square&logo=github" /></a>
<a href="https://github.com/mahsumurebe"><img alt="Author" src="https://img.shields.io/badge/Author-Mahsum%20Urebe-blueviolet?style=flat-square&logo=appveyor" /></a>

## Description

NestJS database connection must be established before using nestjs-sequelize-pagination. You can use the database module
for this. You can review the [sequelize](https://docs.nestjs.com/techniques/database#sequelize-integration) document.

## Integration

To start using it, we first install the required dependencies. In this chapter we will demonstrate the use of the
pagination for nestjs.

You simply need to install the package !

```shell
$ npm install --save nestjs-sequelize-pagination
```

## Getting Started

Once the installation process is complete, we can import the **PaginationModule** into the root **AppModule**

```ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemsModule } from './items/items.module';
import { PaginationModule } from 'nestjs-sequelize-pagination';
import * as SQLite from 'sqlite3';

@Module({
  imports: [
    SequelizeModule.forRoot({
      logging: false,
      synchronize: true,
      autoLoadModels: true,
      retryAttempts: 2,
      retryDelay: 1000,
      dialect: 'sqlite',
      storage: 'tests/db.sqlite',
      dialectOptions: {
        mode:
          SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
      },
    }),
    ItemsModule,
    PaginationModule.forRoot({
      isGlobal: true,
      offset: 50,
      page: 1,
      details: true,
      url: 'http://localhost:3001/',
    }),
  ],
})
export class AppModule {
}
```

The **forRoot()** method supports all the configuration properties exposed by the pagination constuctor . In addition,
there are several extra configuration properties described below.

| Name     | Description                                                | Type                      | Default     |
|----------|------------------------------------------------------------|---------------------------|-------------|
| url      | If you want a global url                                   | _string_                  | `null`      |
| isGlobal | If you want the module globally                            | _boolean_                 | `false`     |
| page     | It is used by default when page information is not sent.   | _number_                  | `1`         |
| offset   | It is used by default when offset information is not sent. | _number_                  | `50`        |
| details  | Used to detail meta information                            | 'necessary' \| 'complete' | `necessary` |

### Service

Sequelize implements the Active Record pattern. With this pattern, you use model classes directly to interact with the
database. To continue the example, we need at least one model. Let's define the Item Model.

```ts
import { Injectable } from '@nestjs/common'
import { PaginationService, PaginationOptions } from 'nestjs-sequelize-pagination'
import { FindAndCountOptions } from 'sequelize';
import { ItemEntity } from './item.entity'

@Injectable()
export class ItemService {
  constructor(
    private readonly paginationService: PaginationService,
    @InjectModel(ItemEntity)
    private readonly itemRepository: typeof ItemEntity,
  ) {
  }

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
}
```

Next, let's look at the **ItemsController:**

```ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common'
import { ItemService } from './item.service'
import { PaginationOptions, PaginationQuery } from 'nestjs-sequelize-pagination'

@Controller('items')
export class ItemsController {
  constructor(private readonly itemService: ItemService) {
  }

  @Get('/')
  findAll(@PaginationQuery() paginateQuery: PaginationOptions) {
    return this.itemService.findAll(paginateQuery);
  }
}
```

Next, let's look at the **ItemsModule:**

```ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemEntity } from './item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [SequelizeModule.forFeature([ItemEntity])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemsModule {
}

```

### Decorator

PaginationQuery decorator extracts the page and offset value from the querystring. This decorator can only be used in
the http context.

```ts
import { PaginationOptions } from "nestjs-sequelize-pagination";

const paginateQuery: PaginationOptions = {
  path: '/item',
  page: 2, // http://localhost:3000/item?page=2
  offset: 10, // http://localhost:3000/item?page=2&offset=10
}
```

## License

nestjs-sequelize-pagination is [MIT licensed](./LICENSE).