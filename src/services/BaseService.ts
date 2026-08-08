import { Model, QueryFilter, UpdateQuery } from "mongoose";
import * as mongoose from "mongoose";

export class BaseService<T extends mongoose.Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const record = new this.model(data);
    return await record.save();
  }

  async getById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async getAll(filter: QueryFilter<T> = {}): Promise<T[]> {
    return await this.model.find(filter).exec();
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  // Named softDelete so the controller can invoke it cleanly
  async softDelete(id: string): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, { isActive: false } as unknown as UpdateQuery<T>, {
        new: true,
      })
      .exec();
  }
}