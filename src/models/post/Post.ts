import {Document, Schema, Model, model} from 'mongoose';
import slug from 'slug';

import uniqueValidator from 'mongoose-unique-validator';
import {UserDocument} from '../user/User';

export type PostDocument = Document & {
  // properties
  _id: Schema.Types.ObjectId,
  title: string,
  text: string,
  slug: string,
  user: Schema.Types.ObjectId,
  favoriteCount: number,

  // methods
  _slugify: () => void,
  toJSON: () => PostJson
}

export type PostModel = Model<PostDocument> & {
  createPost(args: PostDocument, user: UserDocument): Promise<PostDocument>;
  list(skip: number | undefined, limit: number | undefined): Promise<PostDocument>;
}

type PostJson = {
  _id: Schema.Types.ObjectId,
  title: string,
  text: string,
  createdAt: Date
  slug: string,
  user: Schema.Types.ObjectId,
  favoriteCount: number
}

export const PostSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Title is required'],
    minlength: [3, 'Title need to be longer!'],
    unique: true,
  },
  text: {
    type: String,
    trim: true,
    required: [true, 'Text is required!'],
    minlength: [10, 'Text need to be longer!'],
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },
}, {timestamps: true});

PostSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
});

PostSchema.pre('validate', function (next) {
  const post = this as PostDocument;
  post._slugify();

  next();
});

PostSchema.methods = {
  _slugify() {
    this.slug = slug(this.title);
  },
  // override toJson method
  toJSON(): PostJson {
    return {
      _id: this._id,
      title: this.title,
      text: this.text,
      createdAt: this.createdAt,
      slug: this.slug,
      user: this.user,
      favoriteCount: this.favoriteCount,
    };
  },
};

PostSchema.statics = {
  createPost(args: PostDocument, user: UserDocument): Promise<PostDocument> {
    return this.create({
      ...args,
      user,
    });
  },
  list(skip: number = 0, limit: number = 5): Promise<PostDocument> {
    return this.find()
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .populate('user');
  },
};

export const Post = model<PostDocument, PostModel>('Post', PostSchema);
