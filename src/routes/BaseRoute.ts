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
    this.router
      .route('/')
      .post(this.controller.create)
      .get(this.controller.getAll);

    this.router
      .route('/:id')
      .get(this.controller.getById)
      .patch(this.controller.update)
      .delete(this.controller.delete);
  }
}
