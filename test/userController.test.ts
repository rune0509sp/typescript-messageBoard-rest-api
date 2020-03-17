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

  // it('should return 200', async (done) => {
  //   const response =
  //     await request(app).get('/api/v1/user/test')
  //       .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZhNTk4ZTc5NzZmYTkwNjQ4MzdhNWIiLCJpYXQiOjE1ODQwMjg0MDV9.cBZxebNL0FSbDYcfjugKNsuxPW9Bn1oYvY1WwPuta_k')

  //   expect(response.status).toBe(200);
  //   done();
  // });


  // it('should return 500', async (done) => {
  //   const response = await request(app).put('/api/v1/user/signup')
  //     .send({
  //       'email': 'go@go.com',
  //       'password': 'aA123456',
  //       'userName': 'gogo',
  //       'firstName': 'haha',
  //       'lastName': 'lalala',
  //     })
  //   expect(response.status).toBe(500);
  //   done();
  // });

  // it('should return 422', async (done) => {
  //   const response = await request(app).put('/user/signup')
  //       .send({
  //         'email': 'good',
  //         'password': '12',
  //         'confirmPassword': '1',
  //         'name': 'aa',
  //       }).set('Accept', 'application/json');
  //   expect(response.status).toBe(422);
  //   done();
  // });
  //   it('Login should return 200', async (done) => {
  //     const response = await request(app).post('/api/v1/users/login').send({
  //       'email': 'go@go.com',
  //       'password': 'aA123456'
  //     })
  //     console.log(response.body);
  //     expect(response.status).toBe(200);
  //     done();
  //   })
});
