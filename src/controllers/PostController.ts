import {Request, Response, NextFunction} from 'express';
import HTTPStatus from 'http-status';

import {Post} from '../models/post/Post';
import {controller, get, post, use, patch} from './decorators';
import {authJwt} from '../configs/passport';
import {createPostValidation, updatePostValidation} from '../models/post/postValidation';
import {validator} from '../middlewares/validationMiddleware';
import {UserDocument, User} from 'src/models/user/User';
import httpStatus from 'http-status';
import {IError} from 'src/middlewares';

/**
 *  root/api/version/post
 */
@controller('/api/v1/posts')
class PostController {
  /**
   * root/api/version/post
   */
  @post('/')
  @use(authJwt)
  @use(validator(createPostValidation))
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as UserDocument;

      const post = await Post.createPost(req.body, user._id);
      return res.status(HTTPStatus.CREATED).json(post);

    } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
  }
  /**
   *  root/api/version/post?id = 1
   */
  @get('/:id')
  async getPostPyId(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.params && req.params.id) {
        const post = await Post.findById(req.params.id).populate('user');

        if (!post) {
          const error: IError = new Error('could not get post');
          error.statusCode = HTTPStatus.NOT_FOUND;
          return next(error);
        }

        return res.status(HTTPStatus.OK).json(post);
      }
    } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
  }

  /**
   *  root/api/version/post
   * option query ?currentPage=number&perPage=number
   * default currentPage=1 limit=5
   */
  @get('/')
  async getPostList(req: Request, res: Response, next: NextFunction) {
    const {currentPage, perPage} = req.query;
    try {
      const posts = await Post.list(
        ((currentPage - 1) * perPage),
        parseInt(perPage));
      return res.status(HTTPStatus.OK).json(posts);
    } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
  }

  @patch('/:id')
  @use(authJwt)
  @use(validator(updatePostValidation))
  async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        const error: IError = new Error('can not find post');
        error.statusCode = httpStatus.NOT_FOUND;
        return next(error);
      }

      const user = req.user as UserDocument;
      if (post.user.toString() !== user._id.toString()) {
        const error: IError = new Error('not Authorized');
        error.statusCode = httpStatus.UNAUTHORIZED;
        return next(error);
      }

      // ['title','text']
      Object.keys(req.body).forEach(key => {
        post[key] = req.body[key];
      });

      return res.status(HTTPStatus.OK).json(await post.save());
    } catch (e) {
      return res.status(httpStatus.BAD_REQUEST).json(e);
    }
  }
}
