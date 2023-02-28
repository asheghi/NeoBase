import { ax } from "../plugins/axios";
import { getLogger } from "../plugins/log";
const log = getLogger("API");
export const Api = {
  Collections: () => ({
    create(payload) {
      return ax.post("collections/", payload);
    },
    list() {
      return ax.get("collections/");
    },
    delete(name) {
      return ax.delete("collections/" + name);
    },
    saveAccessConfig(collection, payload) {
      return ax.post("collections/access-config/" + name);
    },
    getAccessConfig(collection) {
      return ax.post("collections/access-config/" + name);
    },
  }),
  login(payload) {
    return ax.post("auth/login", payload);
  },
  register(payload) {
    return ax.post("auth/register", payload);
  },
  me() {
    return ax.get("auth/me");
  },
  Documents(collection) {
    return {
      create(payload) {
        return ax.post(`documents/${collection}/create`, payload);
      },
      updateOne(filter, payload) {
        return ax.post(`documents/${collection}/updateOne`, {
          filter,
          update: payload,
        });
      },
      find(filter, projection, options) {
        const query = {
          filter,
          projection,
          options,
        };
        return ax.post(`documents/${collection}/find`, query);
      },
      findOne(filter, projection, options) {
        const query = {
          filter,
          projection,
          options,
        };
        return ax.post(`documents/${collection}/findOne`, query);
      },
      count(filter = {}) {
        return ax.post(`documents/${collection}/count`, { filter });
      },
      deleteOne(payload) {
        return ax.post(`documents/${collection}/deleteOne`, payload);
      },
    };
  },
  Users: (project) => ({
    find() {
      return ax.get(`users`);
    },
    newUser(payload) {
      return ax.post("users", payload);
    },
    deleteUser(user) {
      return ax.delete(`users/${user._id}`);
    },
    fetchUser(uid) {
      return ax.get(`users/${uid}`);
    },
    updateUser(uid, payload) {
      return ax.put(`users/${uid}`, payload);
    },
  }),
  AccessControl() {
    return {
      getAccessConfig(collection) {
        return ax.get(`collections/access-config/${collection}`);
      },
      resetConfig(collection) {
        let url = `collections/access-config/${collection}`;
        return ax.delete(url);
      },
      updateConfig(collection, config) {
        return ax.post(`collections/access-config/${collection}`, config);
      },
    };
  },
};
