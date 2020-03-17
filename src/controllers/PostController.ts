import {Request, Response, NextFunction} from 'express';
import HTTPStatus from 'http-status';

import {Post, PostDocument} from '../models/post/Post';
import {controller, get, post, use, patch, del} from './decorators';
import {authJwt} from '../configs/passport';
import {createPostValidation, updatePostValidation}
  from '../models/post/postValidation';
import {validator} from '../middlewares/validationMiddleware';
import {UserDocument, User} from '../models/user/User';
import httpStatus from 'http-status';

/**
 *  root/api/version/post
 */
@controller('/api/v1/posts')
class PostController {
  /**
   * root/api/version/posts
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
   *  root/api/version/posts/postid
   */
  @get('/:id')
  @use(authJwt)
  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as UserDocument;
      const promise = await Promise.all([
        User.findById(user._id),
        Post.findById(req.params.id).populate('user'),
        Post.findById(req.params.id)
      ]);

      if (!promise[0]) {
        return res.status(httpStatus.UNAUTHORIZED);
      }
      if (!promise[1]) {
        return res.status(httpStatus.NOT_FOUND);
      }

      const favorite = promise[0]._favorites.isPostFavorite(req.params.id);
      const post = promise[1];
      const isSubscribeTheCreator = promise[0]._favorites.isSubscribe(promise[2]!.user.toString());


      return res.status(HTTPStatus.OK).json({
        ...post.toJSON(),
        favorite,
        isSubscribeTheCreator
      });
    } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
  }

  /**
   *  root/api/version/posts
   * option query ?currentPage=number&perPage=number
   * default currentPage=1 limit=5
   */
  @get('/')
  @use(authJwt)
  async getPostList(req: Request, res: Response, next: NextFunction) {
    const {currentPage, perPage} = req.query;
    try {
      const user = req.user as UserDocument;
      const promise = await Promise.all([
        User.findById(user._id),
        Post.list((currentPage - 1) * perPage, parseInt(perPage)),
      ]);

      if (!promise[1]) {
        return res.status(httpStatus.NOT_FOUND);
      }
      if (!promise[0]) {
        return res.status(httpStatus.UNAUTHORIZED);
      }

      const posts = promise[1].reduce((arr: object[], post) => {
        const favorite = promise[0]!._favorites.isPostFavorite(post._id);
        arr.push({
          ...post.toJSON(),
          favorite,
        });
        return arr;
      }, []);

      return res.status(HTTPStatus.OK).json(posts);
    } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
  }

  /**
   *  root/api/version/posts/postid
   */
  @patch('/:id')
  @use(authJwt)
  @use(validator(updatePostValidation))
  async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }

      const user = req.user as UserDocument;
      if (post.user.toString() !== user._id.toString()) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
      }

      // ['title','text']
      Object.keys(req.body).forEach((key) => {
        post[key] = req.body[key];
      });

      return res.status(HTTPStatus.OK).json(await post.save());
    } catch (e) {
      return res.status(httpStatus.BAD_REQUEST).json(e);
    }
  }

  /**
   *  root/api/version/posts/postid
   */
  @del('/:id')
  @use(authJwt)
  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      const user = req.user as UserDocument;
      if (post.user.toString() !== user._id.toString()) {
        return res.sendStatus(httpStatus.UNAUTHORIZED); // TODO: test change
      }

      await post.remove();
      return res.sendStatus(HTTPStatus.OK);
    } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
  }

  /**
   * root/api/version/postid/favorite
   */
  @post('/:id/favorite')
  @use(authJwt)
  async favoritePost(req, res) {
    try {
      const user = await User.findById(req.user._id);
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(httpStatus.NOT_FOUND);
      }
      if (!user) {
        return res.status(HTTPStatus.UNAUTHORIZED);
      }
      console.log(req.params.id);
      await user._favorites.posts(req.params.id);
      return res.sendStatus(httpStatus.OK);
    } catch (e) {
      return res.sendStatus(httpStatus.BAD_REQUEST).json(e);
    }
  }
}
