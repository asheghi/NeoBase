import { Injectable, Logger } from '@nestjs/common';
import * as yaml from 'js-yaml';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { configSchema } from './config.schema';
import { Config } from './config.type';

@Injectable()
export class ConfigService {
  private config: Config;

  constructor(private logger: Logger) {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): any {
    const defaultConfigPath = path.join(
      __dirname,
      '../../../config.default.yaml',
    );
    const fileContents = fs.readFileSync(defaultConfigPath, 'utf8');
    return yaml.load(fileContents);
    // todo load custom config from cli parameter
  }

  private validateConfig() {
    try {
      this.config = configSchema.parse(this.config);
    } catch (error) {
      this.logger.error(error);
      throw new Error('invalid config file');
    }
  }
  // todo return a proxy to have more control
  getConfig(): Config {
    return { ...this.config };
  }
}
