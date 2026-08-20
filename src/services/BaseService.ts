import { Model, QueryFilter, UpdateQuery } from 'mongoose';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import { PaginatedResult } from '../interface/Pagination';
import { PaginationParams } from '../utilities/pagination';

function generateCode(): string {
  return crypto.randomBytes(5).toString('hex');
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '');
  return base + '-' + crypto.randomBytes(3).toString('hex');
}

export class BaseService<T extends mongoose.Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const code = generateCode();
    const slug = (data as Record<string, unknown>).slug as string || generateSlug((data as Record<string, unknown>).name as string || code);
    const payload = { ...data, code, slug };
    const record = new this.model(payload);
    return await record.save();
  }

  async getById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async getByCode(code: string): Promise<T | null> {
    return await this.model.findOne({ code }).exec();
  }

  async getBySlug(slug: string): Promise<T | null> {
    return await this.model.findOne({ slug }).exec();
  }

  async getAll(filter: QueryFilter<T> = {}): Promise<T[]> {
    return await this.model.find(filter).exec();
  }

  async getAllPaginated(
    filter: QueryFilter<T> = {},
    params: PaginationParams,
    search?: string,
    searchFields: string[] = ['title', 'name', 'description'],
    exactMatch?: boolean,
  ): Promise<PaginatedResult<T>> {
    const query: Record<string, unknown> = { ...filter, isActive: { $ne: false } };

    if (search && searchFields.length > 0) {
      const searchRegex = exactMatch
        ? new RegExp(`^${search}$`, 'i')
        : new RegExp(search, 'i');
      query['$or'] = searchFields.map((field) => ({ [field]: searchRegex }));
    }

    const [data, total] = await Promise.all([
      this.model.find(query as QueryFilter<T>).skip(params.skip).limit(params.limit).exec(),
      this.model.countDocuments(query as QueryFilter<T>).exec(),
    ]);

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }

  async softDelete(id: string): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, { isActive: false } as unknown as UpdateQuery<T>, { new: true })
      .exec();
  }
}