import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { PaginationOptions } from '../interfaces';
import { Request } from 'express';
import { OnlyHttpContextException } from '../exceptions';

export const PaginationQuery = createParamDecorator(
  (data: any, context: ExecutionContextHost) => {
    if (context.getType() === 'http') {
      const host = context.switchToHttp();
      const req = host.getRequest<Request>();

      const payload: Partial<PaginationOptions> = {
        path: req.path,
      };
      if (req.query) {
        if ('offset' in req.query) {
          payload['offset'] = parseInt(req.query.offset as string);
        }
        if ('page' in req.query) {
          payload['page'] = parseInt(req.query.page as string);
        }
      }
      return payload;
    }
    throw new OnlyHttpContextException();
  },
);
