import request from 'supertest';
import { application, shutDown } from '../../src/server';
import mongoose from 'mongoose';
import { after } from 'node:test';

describe('Application', () => {
  const user = new Date().getTime().toString();
  let userId: string = '';

  afterAll((done) => {
    shutDown();
    return done();
  });

  it('Starts and has the proper test environment', async () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(application).toBeDefined();
  });

  it('Returns all options allowed when called from the HTTP method options', async () => {
    const response = await request(application).options('/');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-methods']).toBe(
      'PUT, POST, PATCH, DELETE, GET'
    );
  });

  it('Returns health check', async () => {
    await request(application).get('/healthcheck').expect(200);
  });

  it('Returns 404 when the route requested is not found.', async () => {
    await request(application).get('/test').expect(404);
  });

  it('Create user', async () => {
    const response = await request(application)
      .post('/users/create')
      .send({
        email: `${user}@test.com`,
        role: ['admin'],
      })
      .expect(201);

    userId = response.body;
  });

  it('Create failed user email validation', async () => {
    await request(application)
      .post('/users/create')
      .send({
        email: `${user}test.com`,
        role: ['admin'],
      })
      .expect(422);
  });

  it('Create failed role array format validation', async () => {
    await request(application)
      .post('/users/create')
      .send({
        email: `${user}@test.com`,
        role: 'admin',
      })
      .expect(422);
  });

  it('Get user', async () => {
    await request(application).get(`/users/get/${userId}`).expect(200);
  });

  it('Get user not found', async () => {
    const response = await request(application)
      .get(`/users/get/667c31cbc3c1cebc2082a89a`)
      .expect(404);
    console.log(response.body);

    expect(response.body.error).toBe('NOT FOUND');
  });

  it('Update user', async () => {
    await request(application)
      .patch(`/users/update/${userId}`)
      .send({
        role: ['role'],
      })
      .expect(201);
  });

  it('Update user not found', async () => {
    await request(application)
      .patch(`/users/update/667c31cbc3c1cebc2082a89a`)
      .send({
        role: ['role'],
      })
      .expect(404);
  });

  it('Query user', async () => {
    await request(application)
      .post(`/users/query`)
      .send({
        email: `${user}@test.com`,
      })
      .expect(200);
  });

  it('Delete user not found', async () => {
    await request(application)
      .delete(`/users/delete/667c31cbc3c1cebc2082a89a`)
      .expect(404);
  });

  it('Delete user', async () => {
    await request(application).delete(`/users/delete/${userId}`).expect(200);
  });
});
