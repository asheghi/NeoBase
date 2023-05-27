import { z } from 'zod';

export const configSchema = z
  .object({
    application: z.object({
      name: z.string(),
    }),
    server: z
      .object({
        host: z.string(),
        protocol: z.string(),
        port: z.number(),
      })
      .required(),
    database: z.object({
      url: z.string(),
    }),
    session: z.object({
      secret: z.string(),
      db_url: z.string(),
      max_age: z.number(),
    }),
  })
  .required();
