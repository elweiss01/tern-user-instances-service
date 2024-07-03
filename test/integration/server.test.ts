import request from 'supertest';
import { application, shutDown } from '../../src/server';
import { after } from 'node:test';

describe('Application', () => {
  afterAll(() => {
    shutDown();
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

  it('Returns 404 when the route requested is not found.', async () => {
    const response = await request(application).get(
      '/a/cute/route/that/does/not/exist/'
    );

    expect(response.status).toBe(404);
  });
});
