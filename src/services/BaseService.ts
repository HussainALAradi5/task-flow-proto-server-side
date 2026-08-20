import { Model, QueryFilter, UpdateQuery } from 'mongoose';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import { PaginatedResult } from '../interface/Pagination';
import { PaginationParams } from '../utilities/pagination';

function generateCode(): string {
  return crypto.randomBytes(5).toString('hex');
}

export class BaseService<T extends mongoose.Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const payload = {
      ...data,
      code: (data as any).code || generateCode(),
    };
    const record = new this.model(payload);
    return await record.save();
  }

  async getById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async getByCode(code: string): Promise<T | null> {
    return await this.model.findOne({ code }).exec();
  }

  async getAll(filter: QueryFilter<T> = {}): Promise<T[]> {
    return await this.model.find(filter).exec();
  }

  async getAllPaginated(
    filter: QueryFilter<T> = {},
    params: PaginationParams,
  ): Promise<PaginatedResult<T>> {
    const [data, total] = await Promise.all([
      this.model.find(filter).skip(params.skip).limit(params.limit).exec(),
      this.model.countDocuments(filter).exec(),
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