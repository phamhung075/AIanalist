// contact.interface.ts
export interface IContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
