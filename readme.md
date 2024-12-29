# RESTful API Implementation Guide with Node.js, Express.js, and TypeScript

## 📚 **Project Foundation and Tools**
- **Node.js & Express.js:** Web server framework for handling HTTP requests.
- **TypeScript:** Strong typing and better development experience.
- **express-route-tracker:** Route management with HATEOAS support.
- **dotenv:** Environment variable management.
- **Firebase:** Database and authentication.

## 📖 **Key RESTful API Design Principles**
1. **Resources:** Represent data as resources (e.g., contacts, products).
2. **HTTP Methods:**
   - **GET:** Retrieve data.
   - **POST:** Create resources.
   - **PUT:** Fully update a resource.
   - **PATCH:** Partially update a resource.
   - **DELETE:** Remove a resource.
3. **Status Codes:** Use meaningful HTTP status codes (e.g., 200 OK, 201 Created, 400 Bad Request).
4. **HATEOAS:** Enable API discoverability through hypermedia links.
5. **JSON:** Use JSON for data exchange.

## 🛠️ **Implementation Steps**
### 1. **Router Creation**
- Use `createRouter(__filename)` for defining routes.

**Example:**
```typescript
import { createRouter } from 'express-route-tracker';
import { Router } from 'express';

const router: Router = createRouter(__filename);

router.get('/example', (req, res) => {
  res.json({ message: 'Hello from example route!' });
});

export default router;
```
- Track file sources with `express-route-tracker`.

### 2. **HATEOAS Integration**
- Add `createHATEOASMiddleware` to your routes.

**Example:**
```typescript
import { createHATEOASMiddleware } from 'express-route-tracker';
import { Router } from 'express';

const router: Router = createRouter(__filename);

router.use(createHATEOASMiddleware({
  autoIncludeSameRoute: true,
  baseUrl: '/api',
  includePagination: true,
  customLinks: {
    self: '/api/example',
    docs: '/api/docs'
  }
}));

router.get('/example', (req, res) => {
  res.json({ message: 'Hello with HATEOAS links!' });
});

export default router;
```
- Enable pagination and custom link generation.

### 3. **Module-Based Routes**
- Organize routes in dedicated directories (e.g., `src/modules/contact`).

### 4. **Controllers**
- Handle incoming requests.

**Example:**
```typescript
import { Request, Response } from 'express';
import { RestHandler } from '@/core/helper/http-status/common/RestHandler';

export const getExampleData = (req: Request, res: Response) => {
  try {
    const data = { id: 1, name: 'Sample Data' };
    RestHandler.success(req, res, {
      data,
      message: 'Data retrieved successfully'
    });
  } catch (error) {
    RestHandler.error(req, res, {
      message: 'Failed to retrieve data'
    });
  }
};
```
- Validate data using `validateSchema(CreateContactSchema)`.

### 5. **Services**
- Encapsulate business logic (e.g., `contact.service.ts`).

**Example:**
```typescript
import { firestore } from '@/core/database/firebase';

export class ContactService {
  async getContactById(contactId: string) {
    try {
      const contactRef = firestore.collection('contacts').doc(contactId);
      const doc = await contactRef.get();
      if (!doc.exists) {
        throw new Error('Contact not found');
      }
      return doc.data();
    } catch (error) {
      console.error('Failed to fetch contact:', error);
      throw error;
    }
  }

  async createContact(contactData: any) {
    try {
      const contactRef = await firestore.collection('contacts').add(contactData);
      return { id: contactRef.id, ...contactData };
    } catch (error) {
      console.error('Failed to create contact:', error);
      throw error;
    }
  }
}
```

### 6. **Repositories**
- Abstract data access logic (e.g., `contact.repository.ts`).

### 7. **Response Handling**
- Use `RestHandler.success` for successful responses.
- Use `RestHandler.error` for error responses.

### 8. **Validation**
- Employ **Zod** for schema-based input validation.

## 🔗 **HATEOAS Details**
- Automatically generates hypermedia links (`self`, `next`, `prev`).
- Pagination links are added with `includePagination`.

## ⚙️ **Configuration**
- `src/_core/helper/http-status/common/api-config.ts` manages API prefix, pagination, rate limits, and CORS.

## 🚨 **Error Management**
- Centralized error handling with `RestHandler.error`.
- Error codes defined in `HttpStatusCode.ts`.

## ✅ **Steps Summary**
1. Define Resources.
2. Map Routes.
3. Implement Controllers.
4. Add Services.
5. Create Repositories.
6. Integrate HATEOAS.
7. Validate Input.
8. Handle Errors.

By following these guidelines, you'll have a scalable and efficient RESTful API ready for production. 🚀

> For detailed code examples, check `src/modules/contact` in your project repository.

**Happy Coding! 🧑‍💻**

