import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../src/app';

describe('GET', () => {
  beforeAll(async () => {
    await mongoose.connect(`mongodb+srv://admin:a123456@cluster0-fyne9.mongodb.net/message-dev?retryWrites=true&w=majority
    `, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  // it('should return 200', async (done) => {
  //   const response = await request(app).get('/')

  //   expect(response.status).toBe(200);
  //   done();
  // });

  // it('crate post should return 201', async (done) => {
  //   const response =
  //     await request(app).post('/api/v1/post').send({
  //       "title": "this is title 11",
  //       "text": "this is text11",
  //     })
  //       .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZhNTk4ZTc5NzZmYTkwNjQ4MzdhNWIiLCJpYXQiOjE1ODQxNjQ5NjMsImV4cCI6MTU4NDI1MTM2M30.Kq6OozPyu6bQckEIX49gwrfNeY9qgq_Fk-pZLQ75Jtg')

  //   expect(response.status).toBe(201);
  //   done();
  // });

  // it('get list of posts should return 200', async (done) => {
  //   const response =
  //     await request(app).get('/api/v1/posts').query({
  //       currentPage: 2,
  //       perPage: 3
  //     })

  //   console.log(response.body);

  //   expect(response.status).toBe(200);
  //   done();
  // });

  it('update post should return 200', async (done) => {
    const response =
      await request(app).patch('/api/v1/posts/5e6a6d92fb062f91e8301f45')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZhNTk4ZTc5NzZmYTkwNjQ4MzdhNWIiLCJpYXQiOjE1ODQxNjQ5NjMsImV4cCI6MTU4NDI1MTM2M30.Kq6OozPyu6bQckEIX49gwrfNeY9qgq_Fk-pZLQ75Jtg')
        .send({
          title: 'title 1 hello world'
        })
    console.log(response.body);

    expect(response.status).toBe(200);
    done();
  })
});
