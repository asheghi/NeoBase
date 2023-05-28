import { z } from 'zod';
import { AppFactory } from '../../app/app';
import { UserService } from '../../modules/user/user.service';
import { Logger } from '@nestjs/common';

const createUserSchema = z.object({
  email: z.string().email().nonempty(),
  roles: z.array(z.string()),
  password: z
    .string()
    .min(8, { message: 'password is too short' })
    .max(128, { message: 'password is too long' }),
});
export const createUserAction = async (
  payload: z.infer<typeof createUserSchema>,
) => {
  const parsed = createUserSchema.parse(payload);
  const app = await AppFactory.buildApp(false);

  const logger = await app.get(Logger);
  const userService = app.get(UserService);

  try {
    const createdUser = await userService.createUser({
      email: parsed.email,
      password: parsed.password,
      roles: parsed.roles,
    });
    logger.log(`created new user with email:"${createdUser.email}"`);
  } catch (error) {
    logger.error(error);
  }
};
