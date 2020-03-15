import {Schema, Document, model, Model} from 'mongoose';
import validator from 'validator';
import {compareSync, hashSync} from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

import {passwordReg} from './userValidation';
import {constants} from '../../configs/constants';

export type UserDocument = Document & {
  // properties
  _id: Schema.Types.ObjectId,
  email: string,
  firstName: string,
  lastName: string,
  userName: string,
  password: string,


  // methods
  _hashPassword: (password: string) => string,
  authenticateUser: (password: string) => boolean,
  createToken: () => string,
  toJSON: () => UserJson,
  toAuthJSON: () => UserJson
}

export type UserModel = Model<UserDocument> & {}

export type UserJson = {
  _id: Schema.Types.ObjectId,
  userName: string,
  token?: string
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
}, {timestamps: true});

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
    };
  },

};

UserSchema.statics = {
}

export const User = model<UserDocument, UserModel>('User', UserSchema);
