import { z } from 'zod';
import { configSchema } from './config.schema';

export type Config = z.infer<typeof configSchema>;
export const Config = Symbol('Config');
