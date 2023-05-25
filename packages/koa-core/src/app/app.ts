import Koa, { Context, Next } from 'koa';
import { container } from '../container';
import { mainModule } from '../modules/main.module';
import { Module } from '../types';
import { initializeDependencies } from './initializeDependencies';
import Router from 'koa-router';


async function bootstrap(module: Module) {
  const app = new Koa();

  const router = new Router();
  await initializeDependencies(module, { app, container, router });

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(3000, () => {
    console.log('Server is running on  http://localhost:3000');
  });
}

bootstrap(mainModule);

