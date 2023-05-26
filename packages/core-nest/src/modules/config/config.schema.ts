import { z } from 'zod';

export const configSchema = z
  .object({
    server: z
      .object({
        host: z.string(),
        protocol: z.string(),
        port: z.number(),
      })
      .required(),
  })
  .required();
