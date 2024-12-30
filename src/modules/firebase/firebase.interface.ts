// firebase.interface.ts
export interface IFirebase {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
