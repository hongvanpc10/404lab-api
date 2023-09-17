import { Type } from 'class-transformer';
import { Model, FilterQuery } from 'mongoose';

export class PaginationOptions {
  @Type(() => Number)
  limit?: number;

  @Type(() => Number)
  page?: number;

  @Type(() => String)
  sort?: string;

  @Type(() => Number)
  order?: 1 | -1;
}

type Populate = [string, string, string?];

export default async function paginate<T = any>(
  model: Model<T>,
  filter: FilterQuery<T>,
  options?: {
    paginationOptions?: PaginationOptions;
    populate?: Populate[];
    select?: string;
  },
) {
  const {
    limit = 10,
    page = 1,
    sort = 'createdAt',
    order = -1,
  } = options.paginationOptions;

  const result = await model.aggregate([
    {
      $facet: {
        data: [
          { $match: filter },
          { $sort: { [sort]: order } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          ...(options.populate
            ? options.populate.map(([field, from, project]) => ({
                $lookup: {
                  from,
                  localField: field,
                  foreignField: '_id',
                  as: field,
                  ...(project
                    ? {
                        pipeline: [
                          {
                            $project: project.split(' ').reduce(
                              (prev, cur) => ({
                                ...prev,
                                [cur.slice(cur.startsWith('-') ? 1 : 0)]:
                                  cur.startsWith('-') ? 0 : 1,
                              }),
                              {},
                            ),
                          },
                        ],
                      }
                    : {}),
                },
              }))
            : []),

          ...(options.populate
            ? options.populate.map(([field]) => ({ $unwind: '$' + field }))
            : []),

          ...(options.select
            ? [
                {
                  $project: options.select.split(' ').reduce(
                    (prev, cur) => ({
                      ...prev,
                      [cur.slice(cur.startsWith('-') ? 1 : 0)]: cur.startsWith(
                        '-',
                      )
                        ? 0
                        : 1,
                    }),
                    {},
                  ),
                },
              ]
            : []),
        ],
        total: [{ $match: filter }, { $count: 'count' }],
      },
    },

    {
      $project: {
        data: 1,
        total: { $arrayElemAt: ['$total.count', 0] },
      },
    },
  ]);

  const totalPages = Math.ceil(result[0].total / limit);

  return {
    ...result[0],
    limit,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    hasPrevPage: page > 1,
    prevPage: page > 1 ? page - 1 : null,
  };
}
