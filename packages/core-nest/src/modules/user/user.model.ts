import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email().nonempty(),
  roles: z.array(z.string().nonempty()),
  password: z.string().nonempty(),
  name: z.string().optional(),
});

export type IUser = z.infer<typeof userSchema>;

export class User implements IUser {
  private constructor() {
    //
  }

  /** hashed password */
  password: string;
  email: string;
  roles: string[];
  name?: string;
  id?: string;

  static create(payload: IUser & { id: string }): User {
    // const parsed = userSchema.parse(payload);
    const u = new User();
    u.email = payload.email;
    u.password = payload.password;
    u.name = payload.name;
    u.id = payload.id;
    u.roles = payload.roles;
    return u;
  }
}
