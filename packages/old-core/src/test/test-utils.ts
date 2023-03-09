import express, { Router } from "express";
import supertest from "supertest";

export function superRouter(router: Router) {
  const app = express();
  app.use(router);
  return supertest(app);
}
