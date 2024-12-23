import {app} from '@/_core/server/app/app.service';
import request from 'supertest';
import http from 'http';

let server: http.Server;

beforeAll((done) => {
  server = app.listen(4000, () => {
    console.log('Test server started on port 4000');
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    console.log('Test server stopped');
    done();
  });
});

describe('Contact Routes', () => {
  // Define the base URL as a constant to avoid typos and make changes easier
  const baseUrl = '/api/contacts';  // Changed from '/api/contact'

  it('should create a new contact', async () => {
    const response = await request(app)
      .post(baseUrl)  // Using baseUrl constant
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '1234567890',
        message: 'Test message',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Jane Doe');
  });

  it('should fetch all contacts', async () => {
    const response = await request(app).get(baseUrl);  // Using baseUrl constant
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});