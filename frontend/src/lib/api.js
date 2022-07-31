import { ax } from "../plugins/axios";
import { getLogger } from "../plugins/log";
const log = getLogger("API");
export const Api = {
  Projects: {
    create(payload) {
      return ax.post("projects", payload);
    },
    list() {
      return ax.get("projects");
    },
    delete(name) {
      return ax.delete("projects/" + name);
    },
  },
  Collections: (project) => ({
    create(payload) {
      return ax.post("collections/" + project, payload);
    },
    list() {
      return ax.get("collections/" + project);
    },
    delete(name) {
      return ax.delete("collections/" + project + "/" + name);
    },
    saveAccessConfig(collection, payload) {
      return ax.post("collections/" + project + "/access-config/" + name);
    },
    getAccessConfig(collection) {
      return ax.post("collections/" + project + "/access-config/" + name);
    },
  }),
  login(payload) {
    return ax.post("accounts/login", payload);
  },
  register(payload) {
    return ax.post("accounts/register", payload);
  },
  me() {
    return ax.get("accounts/me");
  },
  Documents(project, collection) {
    return {
      create(payload) {
        return ax.post(`documents/${project}/${collection}/create`, payload);
      },
      updateOne(filter, payload) {
        return ax.post(`documents/${project}/${collection}/updateOne`, {
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
        return ax.post(`documents/${project}/${collection}/find`, query);
      },
      findOne(filter, projection, options) {
        const query = {
          filter,
          projection,
          options,
        };
        return ax.post(`documents/${project}/${collection}/findOne`, query);
      },
      count(filter = {}) {
        return ax.post(`documents/${project}/${collection}/count`, { filter });
      },
      deleteOne(payload) {
        return ax.post(`documents/${project}/${collection}/deleteOne`, payload);
      },
    };
  },
  Users: (project) => ({
    find() {
      return ax.get(`users/${project}`);
    },
    newUser(payload) {
      return ax.post(`users/${project}`, payload);
    },
    deleteUser(user) {
      return ax.delete(`users/${project}/${user._id}`);
    },
    fetchUser(uid) {
      return ax.get(`users/${project}/${uid}`);
    },
    updateUser(uid, payload) {
      return ax.put(`users/${project}/${uid}`, payload);
    },
  }),
  AccessControl(project) {
    return {
      getAccessConfig(collection) {
        return ax.get(`collections/${project}/access-config/${collection}`);
      },
      resetConfig(collection) {
        let url = `collections/${project}/access-config/${collection}`;
        return ax.delete(url);
      },
      updateConfig(collection, config) {
        return ax.post(
          `collections/${project}/access-config/${collection}`,
          config
        );
      },
    };
  },
};
