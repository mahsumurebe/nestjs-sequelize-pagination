import { INestApplication, Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { ApplicationModule } from '../src/app.module';
import { AsyncApplicationModule } from '../src/app-async.module';

function runTests(moduleCls: Type) {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [moduleCls],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  const metaCheck = (meta: any, path?: string) => {
    expect(meta.page).toBe(1);
    expect(meta.nextPage).toBe(2);
    expect(meta.prevPage).toBeNull();
    expect(meta.limit).toBe(50);
    expect(meta.totalItems).toBe(100);
    expect(meta.pageCount).toBe(2);
    expect(meta.itemCount).toBe(50);
    expect(meta.links).toBeDefined();
    expect(meta.links.first).toBe(
      `http://localhost:3001/item${path ? `/${path}` : ''}?page=1&limit=50`,
    );
    expect(meta.links.last).toBe(
      `http://localhost:3001/item${path ? `/${path}` : ''}?page=2&limit=50`,
    );
    expect(meta.links.next).toBe(
      `http://localhost:3001/item${path ? `/${path}` : ''}?page=2&limit=50`,
    );
    expect(meta.links.previous).toBeNull();
  };

  const itemsCheck = (items: any) => {
    items.forEach(
      (item: { name: string; description: string }, index: number) => {
        expect(item.name).toBe(`Pagination ${index}`);
        expect(item.description).toBe('Pagination test !');
      },
    );
  };

  it('should return batch created entities', () => {
    return request(server)
      .post('/item')
      .expect(201)
      .expect((res) => {
        const body: { name: string; description: string }[] = res.body;
        body.forEach((item, index) => {
          expect(item.name).toBe(`Pagination ${index}`);
          expect(item.description).toBe('Pagination test !');
        });
      });
  });

  it('should return paginated items', () => {
    return request(server)
      .get('/item')
      .expect(200)
      .expect((res) => {
        const { meta, items } = res.body;

        expect(meta).toBeDefined();
        expect(items).toBeDefined();

        metaCheck(meta);
        itemsCheck(items);
      });
  });

  it('should return paginated items with another class', () => {
    return request(server)
      .get('/item/diff-cls')
      .expect(200)
      .expect((res) => {
        const { metaData, itemsList } = res.body;

        expect(metaData).toBeDefined();
        expect(itemsList).toBeDefined();

        metaCheck(metaData, 'diff-cls');
        itemsCheck(itemsList);
      });
  });

  afterEach(async () => {
    await app.close();
  });
}

describe('Pagination', () => {
  describe('Testing for sync configuration', () => {
    runTests(ApplicationModule);
  });

  describe('Testing for async configuration', () => {
    runTests(AsyncApplicationModule);
  });
});
