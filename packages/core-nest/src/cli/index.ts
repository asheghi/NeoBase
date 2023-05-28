import { Command, Option } from 'commander';
import { bootstrap } from './actions/bootstrap';
import { createUserAction } from './actions/createUser';

// todo move to utils
const randomString = () => {
  return (Math.random() + 1).toString(36).substring(7);
};

const program = new Command();

program
  .command('start')
  .description('Start the application')
  // todo add config argument to be able to override default configurations
  .action(async () => {
    bootstrap();
  });

program
  .command('create-user')
  .description('create user')
  .addOption(new Option('-E, --email <email address>', `email`))
  .addOption(new Option('-P, --password <secure password>', `password`))
  .addOption(new Option('-R, --role <user role>', `role`))
  .action(async (options): Promise<any> => {
    const email = options.email;
    const password = options.password;
    const roles = options.roles;

    try {
      await createUserAction({ email, password, roles });
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program.parse(process.argv);
