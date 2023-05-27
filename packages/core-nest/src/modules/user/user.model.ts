import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  id: z.string().optional(),
});

export class User {
  private constructor() {
    //
  }

  /** hashed password */
  password: string;
  email: string;
  name?: string;
  id: string;

  static create({
    id,
    email,
    password,
    name,
  }: z.infer<typeof userSchema>): User {
    const u = new User();
    u.email = email;
    u.password = password;
    u.name = name;
    u.id = id;
    return u;
  }
}
