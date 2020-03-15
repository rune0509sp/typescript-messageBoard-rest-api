import {Request, Response, NextFunction} from 'express';
import HTTPStatus from 'http-status';

import {controller, post, put, get, use} from './decorators';
import {User, UserDocument} from '../models/user/User';
import {userSignupValidation} from '../models/user/userValidation';
import {validator} from '../middlewares';
import {authLocal} from '../configs/passport';

/**
 * user route root/api/version/user/
 */
@controller('/api/v1/users')
class UserController {
  /**
   * root/api/version/signup
   */
  @post('/signup')
  @use(validator(userSignupValidation))
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.create(req.body);
      return res.status(HTTPStatus.CREATED).json(user);
    } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
  }

  /**
   * root/api/version/login
   */
  @post('/login')
  @use(authLocal)
  login(req: Request, res: Response, next: NextFunction) {
    const user = req.user as UserDocument;
    res.status(HTTPStatus.OK).json(user.toAuthJSON());
    return next();
  }
}
