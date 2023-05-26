import { Command } from 'commander';
import { bootstrap } from '../app/bootstrap';

const program = new Command();

program
  .command('start')
  .description('Start the application')
  .action(async () => {
    bootstrap();
  });

program.parse(process.argv);
