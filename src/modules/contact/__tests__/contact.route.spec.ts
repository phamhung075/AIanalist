import {app} from '@/_core/server/app/app.service';
import request from 'supertest';

describe('Contact Routes', () => {
  it('should create a new contact', async () => {
    const response = await request(app)
      .post('/api/contact')
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
    const response = await request(app).get('/api/contacts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
