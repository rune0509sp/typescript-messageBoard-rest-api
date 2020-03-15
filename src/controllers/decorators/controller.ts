import 'reflect-metadata';

import {AppRouter} from '../../AppRouter';
import {MetadataKey} from './MetadataKeys';
import {RouteMethod} from './RouteMethods';

/**
 * set at above Controller class
 * @param routePrefix  ex. localhost:3000/routePrefix
 */
export function controller(routePrefix: string) {
  return function(target: Function) {
    const router = AppRouter.getInstance();

    for (const key in target.prototype) {
      if (key) {
        const routeHandler = target.prototype[key];
        const path = Reflect.getMetadata(
            MetadataKey.Path,
            target.prototype,
            key);
        const method: RouteMethod = Reflect.getMetadata(
            MetadataKey.Method,
            target.prototype,
            key);
        const middlewares = Reflect.getMetadata(
            MetadataKey.Middleware,
            target.prototype,
            key,
        ) || [];

        if (path) {
          router[method](`${routePrefix}${path}`, ...middlewares, routeHandler);
        }
      }
    }
  };
}
