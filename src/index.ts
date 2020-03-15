import {app} from './app';
import {connectMongoose} from './configs/database';

// connect mongodb
connectMongoose();

app.listen(app.get('port'), () => {
  console.log(
      `
      Server running on port: ${app.get('port')}
      ---
      Running on ${process.env.NODE_ENV}
      ---
    `);
});
