import { Router } from 'express';
import { BaseController } from '../controllers/BaseController';

export class BaseRoute<TController extends BaseController<any>> {
  public router: Router;
  protected controller: TController;

  constructor(controller: TController) {
    this.router = Router();
    this.controller = controller;
    this.initStandardRoutes();
  }

  protected initStandardRoutes(): void {
    // Mutations are registered by each resource route so authorization and
    // validation cannot accidentally be bypassed by a generic handler.
    this.router.get('/', this.controller.getAll);
    this.router.get('/:id', this.controller.getById);
  }
}
