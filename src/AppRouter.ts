import {Router} from 'express';

/**
 * Router class. singleton router
 */
export class AppRouter {
  private static instance: Router;

  /**
   * get router instance. singleton
   * @return {express.Router} instance
   */
  static getInstance(): Router {
    if (!AppRouter.instance) {
      AppRouter.instance = Router();
    }
    return AppRouter.instance;
  }
}
