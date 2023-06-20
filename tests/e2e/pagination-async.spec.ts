import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { AsyncApplicationModule } from '../src/app-async.module';

describe('Sequelize (async configuration)', () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncApplicationModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it('should return batch created entities', () => {
    return request(server)
      .post('/item')
      .expect(201)
      .expect((res) => {
        const body: { name: string; description: string }[] = res.body;
        for (let i = 0; i < 100; i++) {
          const item = body[i];
          if (item.name !== `Pagination ${i}`) throw new Error('invalid name');
          if (item.description !== 'Pagination test !')
            throw new Error('invalid description');
        }
      });
  });

  it('should paginated', () => {
    return request(server)
      .get('/item')
      .expect(200)
      .expect((res) => {
        const body = res.body;

        if ('meta' in body) {
          if (body.meta.page !== 1) {
            throw new Error('Meta: Invalid page number');
          }
          if (body.meta.nextPage !== 2) {
            throw new Error('Meta: Invalid nextPage number');
          }
          if (body.meta.prevPage !== null) {
            throw new Error('Meta: prevPage must be null');
          }
          if (body.meta.offset !== 50) {
            throw new Error('Meta: offset must be 50');
          }
          if (body.meta.totalItems !== 100) {
            throw new Error('Meta: totalItems must be null');
          }
          if (body.meta.pageCount !== 2) {
            throw new Error('Meta: pageCount must be 2');
          }
          if (body.meta.itemCount !== 50) {
            throw new Error('Meta: itemCount must be 50');
          }
          if ('links' in body.meta) {
            if (
              body.meta.links.first !==
              'http://localhost:3001/item?page=1&offset=50'
            ) {
              throw new Error('Meta: links.firstUrl is invalid');
            }
            if (
              body.meta.links.last !==
              'http://localhost:3001/item?page=2&offset=50'
            ) {
              throw new Error('Meta: links.lastUrl is invalid');
            }
            if (
              body.meta.links.next !==
              'http://localhost:3001/item?page=2&offset=50'
            ) {
              throw new Error('Meta: links.nextUrl is invalid');
            }
            if (body.meta.links.previous !== null) {
              throw new Error('Meta: links.prevUrl is invalid');
            }
          } else {
            throw new Error('Meta: links must exist');
          }
        } else {
          throw new Error('meta must exist');
        }

        if ('items' in body) {
          for (let i = 0; i < 50; i++) {
            const item = body.items[i];
            if (
              item.name !== `Pagination ${i}` ||
              item.description !== 'Pagination test !'
            ) {
              throw new Error('Invalid items');
            }
          }
        } else {
          throw new Error('items must exist');
        }
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
