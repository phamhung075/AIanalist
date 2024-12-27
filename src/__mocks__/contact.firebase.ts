export const firestore = {
  collection: jest.fn(() => ({
    add: jest.fn((data) => Promise.resolve({ id: '123', ...data })),
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({
        exists: true,
        id: '123',
        data: () => ({ name: 'Test', email: 'test@test.com', phone: '1234567890' })
      })),
      update: jest.fn(),
      delete: jest.fn()
    })),
    get: jest.fn(() => Promise.resolve({
      docs: [
        {
          id: '123',
          data: () => ({ name: 'Test', email: 'test@test.com', phone: '1234567890' })
        }
      ]
    }))
  }))
};