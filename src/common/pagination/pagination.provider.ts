import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { Paginated } from './paginater.interface';

@Injectable()
export class PaginationProvider {

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto: PaginationQueryDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T>
    ) {
        const { page, limit } = paginationQueryDto;
        const findOptions: FindManyOptions<T> = {
            skip: (page - 1) * limit,
            take: limit,
        };
        if (where) findOptions.where = where;

        const result = await repository.find(findOptions);
        const totalItems = await repository.count(findOptions);
        const totalPages = Math.ceil(totalItems / limit);
        const currentPage = page;
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        const response: Paginated<T> = {
            data: result,
            meta: {
                itemsPerPage: limit,
                totalItems,
                currentPage: page,
                totalPages,
            },
            links: {
                first: `/api/v1/tweets?page=1&limit=${limit}`,
                last: `/api/v1/tweets?page=${Math.ceil(result.length / limit)}&limit=${limit}`,
                current: `/api/v1/tweets?page=${page}&limit=${limit}`,
                next: `/api/v1/tweets?page=${page + 1}&limit=${limit}`,
                previous: `/api/v1/tweets?page=${page - 1}&limit=${limit}`,
            },
        };

        return response;
    }
}
