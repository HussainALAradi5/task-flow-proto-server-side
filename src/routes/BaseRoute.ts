import { Router } from 'express';
import { BaseController } from '../controllers/BaseController';

// Mongoose's Document generic uses `any` internally in its type definitions.
// Any specific type constraint here causes cascading incompatibilities across all route files.
// This is a known Mongoose TypeScript limitation — `any` is required here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class BaseRoute<TController extends BaseController<any>> {
  public router: Router;
  protected controller: TController;

  constructor(controller: TController) {
    this.router = Router();
    this.controller = controller;
    this.initStandardRoutes();
  }

  protected initStandardRoutes(): void {
    // Write routes must be registered by each feature with its own validation and access rules.
    this.router.get('/', this.controller.getAll);
    this.router.get('/:id', this.controller.getById);
  }
}
