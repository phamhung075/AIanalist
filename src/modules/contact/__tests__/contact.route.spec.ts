// __tests__/contact.route.spec.ts
import { app } from '@/_core/server/app/app.service';
import request from 'supertest';
import { IContact } from '../contact.interface';

describe('Contact Routes', () => {
  it('should create a new contact', async () => {
    const response = await request(app)
      .post('/contacts')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '1234567890',
      } as IContact);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Jane Doe');
  });

  it('should fetch all contacts', async () => {
    const response = await request(app).get('/contacts');
    expect(response.status).toBe(200);
  });
});
