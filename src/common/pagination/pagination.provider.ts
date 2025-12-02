import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { Paginated } from './paginater.interface';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request,
    ) { }

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto: PaginationQueryDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T>,
        relations?: string[]
    ): Promise<Paginated<T>> {
        const { page, limit } = paginationQueryDto;
        const findOptions: FindManyOptions<T> = {
            skip: (page - 1) * limit,
            take: limit,
        };
        if (where) findOptions.where = where;
        if (relations) findOptions.relations = relations;

        const [result, totalItems] = await repository.findAndCount(findOptions);

        const totalPages = Math.ceil(totalItems / limit);
        const currentPage = page;
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;
        const baseUrl = this.request.protocol + '://' + this.request.get('host') + '/';
        const newUrl = new URL(this.request.url, baseUrl);

        const response: Paginated<T> = {
            data: result,
            meta: {
                itemsPerPage: limit,
                totalItems,
                currentPage: page,
                totalPages,
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${limit}`,
                last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${limit}`,
                current: `${newUrl.origin}${newUrl.pathname}?page=${currentPage}&limit=${limit}`,
                next: `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${limit}`,
                previous: `${newUrl.origin}${newUrl.pathname}?page=${previousPage}&limit=${limit}`,
            },
        };

        return response;
    }
}
