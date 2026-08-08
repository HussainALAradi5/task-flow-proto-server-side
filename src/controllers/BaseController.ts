import { Request, Response } from 'express';
import { catchAsync } from '../utilities/catchAsync';
import { BaseService } from '../services/BaseService';
import * as mongoose from 'mongoose';

export class BaseController<T extends mongoose.Document> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json({ status: 'success', data: item });
  });

  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const items = await this.service.getAll(req.query);
    res.status(200).json({ status: 'success', data: items });
  });

  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await this.service.getById(id);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: item });
  });

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await this.service.update(id, req.body);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: item });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    // Calling the softDelete function from the service layer
    const item = await this.service.softDelete(id);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Resource deactivated successfully' });
  });
}