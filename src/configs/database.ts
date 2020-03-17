import mongoose, {mongo} from 'mongoose';
import {constants} from './constants';

// export mongoose(DB)
export const connectMongoose = async () => {
  try {
    await mongoose.connect(constants.MONGO_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('mongoDB conneted');
  } catch (err) {
    console.log(
        'MongoDB connection error. Please make sure MongoDB is running. ' +
      err);
    process.exit();
  }
};
