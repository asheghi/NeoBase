function make<T extends readonly string[]>(
  res: string,
  actions: T
): { [K in T[number]]: string } {
  return actions.reduce<{ [K in T[number]]: string }>((acc, action) => {
    acc[action as keyof typeof acc] = res + "/" + action;
    return acc;
  }, {} as { [K in T[number]]: string });
}

export const Permissions = {
  Database: make("database", ["find", "create", "update", "delete"] as const),
  AccessControl: make("access-control", ["read", "write"] as const),
};
