import Router from 'koa-router';
import { Container } from '../container';
import { Module } from '../types';
import Application from 'koa';

export async function initializeDependencies(module: Module, params: { container: Container; app: Application, router: Router; }) {
  for (const depModule of module.dependencies ?? []) {
    await initializeDependencies(depModule, params);
  }

  if (module.init) {
    await module.init(params);
  }

  if (module.mount) {
    await module.mount(params);
  }

  console.log(`Initialized module ${module.name}`);

}
