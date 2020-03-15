import 'reflect-metadata';
import {RequestHandler} from 'express';

import {RouteMethod} from './RouteMethods';
import {MetadataKey} from './MetadataKeys';

interface RouteHandlerDescriptor extends PropertyDescriptor {
  value?: RequestHandler
}
/**
 * routeBinder
 * @param {string} ex. get post
 * @return factory for metadata
 */
function routeBinder(method: string) {
  return function(path: string) {
    return function(target: any, key: string, desc: RouteHandlerDescriptor) {
      Reflect.defineMetadata(MetadataKey.Path, path, target, key);
      Reflect.defineMetadata(MetadataKey.Method, method, target, key);
    };
  };
}

export const get = routeBinder(RouteMethod.Get);
export const put = routeBinder(RouteMethod.Put);
export const post = routeBinder(RouteMethod.Post);
export const del = routeBinder(RouteMethod.Del);
export const patch = routeBinder(RouteMethod.Patch);

