const cache: any = {} as any;

const containers = new Proxy(cache, {
  get: function (target: any, property: string) {
    if (typeof target[property] === "function") {
      return function (...args: any[]) {
        return target[property](...args);
      };
    } else {
      return target[property];
    }
  },
});

const resolvers: any = {};

export const Service = {
  containers,
  addSingleton(name: string, generator: (containers: any) => Promise<void>) {
    resolvers[name] = generator;
  },
  async resolve() {
    Promise.all(
      Object.keys(resolvers).map(async (name) => {
        cache[name] = await resolvers[name];
        console.log("resolved ", name);
      })
    );
  },
};
