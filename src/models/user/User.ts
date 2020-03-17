import {Schema, Document, model, Model} from 'mongoose';
import validator from 'validator';
import {compareSync, hashSync} from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

import {Post} from '../post/Post';
import {passwordReg, userSignupValidation} from './userValidation';
import {constants} from '../../configs/constants';

export type UserDocument = Document & {
  // properties
  _id: Schema.Types.ObjectId,
  email: string,
  firstName: string,
  lastName: string,
  userName: string,
  password: string,
  subscribers: number,
  favorites: {posts: [Schema.Types.ObjectId], subscribes: [Schema.Types.ObjectId]}


  // methods
  _hashPassword: (password: string) => string,
  authenticateUser: (password: string) => boolean,
  createToken: () => string,
  toJSON: () => UserJson,
  toAuthJSON: () => UserJson
  _favorites: {
    posts(postId: string): Promise<UserDocument>,
    isPostFavorite(postId: string): boolean,
    subscribe(userId: string): Promise<string>,
    isSubscribe(userId: string): boolean
  }
}

export type UserModel = Model<UserDocument> & {
  incSubscribeCount(userId: string): Promise<UserDocument>,
  decSubscribeCount(userId: string): Promise<UserDocument>
}

export type UserJson = {
  _id: Schema.Types.ObjectId,
  userName: string,
  token?: string,
  subscribers?: number,
}

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    validate: {
      validator(email: string) {
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email!',
    },
  },
  firstName: {
    type: String,
    required: [true, 'FirstName is required!'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'LsatName is required!'],
    trim: true,
  },
  userName: {
    type: String,
    required: [true, 'UserName is required!'],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    trim: true,
    // can remove it
    minlength: [6, 'Password need to be longer!'],
    validate: {
      validator(password: string) {
        // passwordReg: RegExp
        return passwordReg.test(password);
      },
      message: '{VALUE} is not a valid password!',
    },
  },
  subscribers: {
    type: Number,
    default: 0
  },
  favorites: {
    posts: [{
      type: Schema.Types.ObjectId,
      ref: 'Post',
    }],
    subscribes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
}, {timestamps: true});

// Schema plugin. uniqueValidator
UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
});

UserSchema.pre('save', function (next) {
  const user = this as UserDocument;
  if (user.isModified('password')) {
    user.password = user._hashPassword(user.password);
  }
  return next();
});

UserSchema.methods = {
  _hashPassword(password: string): string {
    return hashSync(password, 12);
  },
  authenticateUser(password: string): boolean {
    return compareSync(password, this.password);
  },
  createToken(): string {
    return jwt.sign(
      {
        _id: this._id,
      },
      constants.JWT_SECRET,
      {expiresIn: constants.JWT_EXPIRESIN},
    );
  },
  toAuthJSON(): UserJson {
    return {
      _id: this._id,
      userName: this.userName,
      token: `Bearer ${this.createToken()}`,
    };
  },
  // override toJSON method
  toJSON(): UserJson {
    return {
      _id: this._id,
      userName: this.userName,
      subscribers: this.subscribers
    };
  },

  _favorites: {
    async posts(postId: string) {
      if (this.favorites.posts.indexOf(postId) >= 0) {
        this.favorites.posts.remove(postId);
        await Post.decFavoriteCount(postId);
      } else {
        this.favorites.posts.push(postId);
        await Post.incFavoriteCount(postId);
      }
      return this.save();
    },
    isPostFavorite(postId: string) {
      if (this.favorites.posts.indexOf(postId) >= 0) {
        return true;
      }

      return false;
    },
    async subscribe(userId: string): Promise<string> {
      let message = '';
      if (userId.toString() === this._id.toString()) {
        message = "can not subscribe to yourself";
      }
      if (this.favorites.subscribes.indexOf(userId) >= 0) {
        this.favorites.subscribes.remove(userId);
        await User.decSubscribeCount(userId);
        message = "unsubscribe the user";
      } else {
        this.favorites.subscribes.push(userId);
        await User.incSubscribeCount(userId);
        message = "subscribe the user";
      }
      await this.save();
      return message;
    },
    isSubscribe(userId: string) {
      if (this.favorites.subscribes.indexOf(userId) >= 0) {
        return true
      }

      return false;
    }
  },
};

UserSchema.statics = {
  incSubscribeCount(userId: Schema.Types.ObjectId): Promise<UserDocument> {
    return this.findByIdAndUpdate(userId, {$inc: {subscribers: 1}});
  },
  decSubscribeCount(userId: Schema.Types.ObjectId): Promise<UserDocument> {
    return this.findByIdAndUpdate(userId, {$inc: {subscribers: -1}});
  }
};

export const User = model<UserDocument, UserModel>('User', UserSchema);
