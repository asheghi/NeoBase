import { makeRolesService } from "./RolesService";

let cache: ReturnType<typeof makeAccessControlService> | undefined = undefined;
export const getAccessConfigService = async () => {
  if (!cache) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cache = await makeAccessControlService();
  }
  return cache;
};

export const makeAccessControlService = async () => {
  const RolesService = await makeRolesService();

  return {
    async canUserDo(
      user: any,
      resource: string,
      action: string,
      applyFilter?: (filter: any) => boolean
    ) {
      const userRoles = user?.roles;
      const roles = await RolesService.findRoles({ name: { $in: userRoles } });
      if (!roles) {
        // todo decide what to do with un-authenticated role
        return false;
      }
      // eslint-disable-next-line no-loops/no-loops
      for (const role of roles) {
        const found = role.permissions.find((it: any) => {
          return it.resource === resource && it.action === action;
        });
        if (!found) {
          continue;
        }
        if (found.enabled) {
          if (!applyFilter) {
            return true;
          }
          // todo apply filters
          return true;
        }
      }

      return false;
    },
  };
};
