import mongoose from "mongoose";
import { getCollection } from "../lib/db-connector";
import { OAuth, OAuthProviders } from "../lib/auth-providers";

enum SelfAuthProviders {
  Password = "password",
}

type AuthProviders = OAuthProviders | SelfAuthProviders;

const defaultRoleSources = [
  SelfAuthProviders.Password,
  OAuthProviders.Github,
  OAuthProviders.Google,
];

export const makeRolesService = async () => {
  const Roles = await getCollection("roles", "auth");
  const Permissions = await getCollection("roles", "auth");
  const Users = await getCollection("users", "auth");

  return {
    findRoles: Roles.find,
    async createRole(name: string, options?: { sources: AuthProviders }) {
      const existing = await Roles.findOne({ name });
      if (existing) {
        throw new Error("role with same name already exists!");
      }
      const permissions: string[] = [];
      const sources = options?.sources ?? defaultRoleSources;
      return Roles.create({ name, permissions, sources });
    },
    getRoles() {
      return Roles.find();
    },
    deleteRole(name: string) {
      return Roles.deleteOne({ name });
    },
    // createPermission(name: string, action: string, resource: ResourceType) {
    //   return Permissions.create({ name, action, resource });
    // },
    // getPermissions() {
    //   return Permissions.find();
    // },
    updatePermission(
      id: string,
      payload: Partial<{ title: string; action: string; resouce: string }>
    ) {
      return Permissions.updateOne({ _id: id }, { $set: payload });
    },
    deletePermission(id: string) {
      return Permissions.deleteOne({ _id: id });
    },
    onUser(user_id: string) {
      return {
        async assingRole(role_id: string) {
          const user = await Users.findById(user_id);
          user.roles.push(new mongoose.Types.ObjectId(role_id));
          await user.save();
        },
        async removeRole(role_id: string) {
          const user = await Users.findById(user_id);
          user.roles = user.roles.filter(
            (it: any) => it.toString() !== role_id
          );
          await user.save();
        },
      };
    },
    onRole(role_id: string) {
      return {
        async addPermission(action: string, resource: string, filter?: any) {
          const role = await Roles.findById(role_id);
          if (!role) {
            throw new Error("could not find role with ID:" + role_id);
          }
          const exists = role.permissions.find(
            (it: any) => it.action == action && it.resouce === resource
          );
          if (exists) {
            return role;
          }
          const permissions = [
            ...(role.permissions ?? []),
            {
              action,
              resource,
              filter,
              enabled: true,
            },
          ];

          await Roles.updateOne({ _id: role._id }, { $set: { permissions } });
          return await Roles.findOne({ _id: role._id });
        },
        async removePermission(action: string, resource: string) {
          const role = await Roles.findById(role_id);
          const permissions = role.permissions.filter(
            (it: any) => !(it.action == action && it.resource == resource)
          );
          await Roles.updateOne({ _id: role._id }, { $set: { permissions } });
          return await Roles.findOne({ _id: role._id });
        },
        async enablePermission(action: string, resource: string) {
          const role = await Roles.findById(role_id);
          const permissions = [...role.permissions];
          const targetPermissionIndex = permissions.findIndex(
            (it: any) => it.action === action && it.resource === resource
          );
          if (targetPermissionIndex < 0) {
            permissions.push({
              action,
              resource,
              enabled: true,
              filter: null,
            });
          } else {
            permissions[targetPermissionIndex].enabled = true;
          }
          await Roles.updateOne({ _id: role._id }, { $set: { permissions } });
          return await Roles.findOne({ _id: role._id });
        },
        async disablePermission(action: string, resource: string) {
          const role = await Roles.findById(role_id);
          const permissions = [...role.permissions];
          const targetPermissionIndex = permissions.findIndex(
            (it: any) => it.action === action && it.resource === resource
          );
          if (targetPermissionIndex < 0) {
            console.error("didnt find that permission!");

            return;
          }
          permissions[targetPermissionIndex].enabled = false;
          await Roles.updateOne({ _id: role._id }, { $set: { permissions } });
          return await Roles.findOne({ _id: role._id });
        },
        async assignUser(user_id: string) {
          const role = await Roles.findById(role_id);
          const user = await Users.findById(user_id);
          const roles = user.roles ?? [];
          if (!roles.includes(role.name)) {
            roles.push(role.name);
            await Users.updateOne({ _id: user._id }, { $set: { roles } });
          }
        },
        async removeUser(user_id: string) {
          const role = await Roles.findById(role_id);
          const user = await Users.findById(user_id);
          if (user?.roles.includes(role.name)) {
            const roles = (user.roles ?? []).filter(
              (it: string) => it !== role.name
            );
            await Users.updateOne({ _id: user._id }, { $set: { roles } });
          }
        },
      };
    },
  };
};
