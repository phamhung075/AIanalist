import { app } from '@/_core/server/app/app.service';
import request from 'supertest';
import { IContact } from './contact.interface';

describe('Contact Routes', () => {
  it('should create a new contact', async () => {
    const response = await request(app)
      .post('/api/contact') // Updated to match the route
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '1234567890',
      } as IContact);

    expect(response.status).toBe(201); // Expect a created status
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Jane Doe');
  });

  it('should fetch all contacts', async () => {
    const response = await request(app).get('/api/contacts'); // Updated to match the route
    expect(response.status).toBe(200); // Expect an OK status
  });
});
