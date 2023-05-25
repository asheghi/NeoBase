export type Provider = (container: Container) => Promise<any>;
export type Providers = { [name: string]: Provider };
export type Dependency = any;
export type Dependencies = { [name: string]: any };

class Container {

  private dependencies: Dependencies = {};
  private providers: Providers = {};

  registerProviders(providers: Providers) {
    for (const name in providers) {
      if (Object.prototype.hasOwnProperty.call(providers, name)) {
        this.registerProvider(name, providers[name])
      }
    }
  }

  async resolveAsync<T>(name: string): Promise<T> {
    const dependency = this.dependencies[name];
    const provider = this.providers[name];
    if (dependency) {
      return dependency;
    }

    if (!provider) {
      throw new Error(`Dependency or Provider for '${name}' is not registered.`);
    }

    this.dependencies[name] = await provider(this);
    return this.dependencies[name];
  }
  async registerProvider<T>(name: string, provider: (container: Container) => Promise<T>) {
    this.providers[name] = provider;
  }

  register<T>(name: string, dependency: T): void {
    this.dependencies[name] = dependency;
  }

  resolve<T>(name: string): T {
    if (!this.dependencies[name]) {
      throw new Error(`Dependency '${name}' is not registered.`);
    }

    return this.dependencies[name];
  }
}

export const container = new Container();

export type { Container };