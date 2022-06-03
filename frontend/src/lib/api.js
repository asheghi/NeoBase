import { ax } from "../plugins/axios";
import { getLogger } from "../plugins/log";
const log = getLogger("API");

export const Api = {
  Projects: {
    async create(payload) {
      const { data, status } = await ax.post("projects", payload);
      return { data, status };
    },
    async list() {
      const { data, status } = await ax.get("projects");
      return { data, status };
    },
    async delete(name) {
      const { data, status } = await ax.delete("projects/" + name);
      return { data, status };
    },
  },
  Collections: (project) => ({
    async create(payload) {
      const { data, status } = await ax.post("collections/" + project, payload);
      return { data, status };
    },
    async list() {
      const { data, status } = await ax.get("collections/" + project);
      return { data, status };
    },
    async delete(name) {
      const { data, status } = await ax.delete(
        "collections/" + project + "/" + name
      );
      return { data, status };
    },
    async saveAccessConfig(collection, payload) {
      const { data, status } = await ax.post(
        "collections/" + project + "/access-config/" + name
      );
      return { data, status };
    },
    async getAccessConfig(collection) {
      const { data, status } = await ax.post(
        "collections/" + project + "/access-config/" + name
      );
      return { data, status };
    },
  }),
  async login(payload) {
    const { data, status } = await ax.post("accounts/login", payload);
    return { data, status };
  },
  async register(payload) {
    const { data, status } = await ax.post("accounts/register", payload);
    return { data, status };
  },
  async me() {
    const { data, status } = await ax.get("accounts/me");
    return { data, status };
  },
  Documents(project, collection) {
    return {
      async create(payload) {
        const { data, status } = await ax.post(
          `documents/${project}/${collection}/create`,
          payload
        );
        return { data, status };
      },
      async updateOne(filter, payload) {
        const { data, status } = await ax.put(
          `documents/${project}/${collection}/updateOne`,
          payload,
          {
            params: filter,
          }
        );
        return { data, status };
      },
      async find({ params } = {}) {
        const { data, status } = await ax.get(
          `documents/${project}/${collection}/find`,
          { params }
        );
        return { data, status };
      },
      async findOne({ params } = {}) {
        log.debug("find one doc called with", params);
        const { data, status } = await ax.get(
          `documents/${project}/${collection}/findOne`,
          { params }
        );
        return { data, status };
      },
      async count() {
        const { data, status } = await ax.get(
          `documents/${project}/${collection}/count`
        );
        return { data, status };
      },
      async deleteOne(payload) {
        const { data, status } = await ax.post(
          `documents/${project}/${collection}/deleteOne`,
          payload
        );
        return { data, status };
      },
    };
  },
  Users: (project) => ({
    async find() {
      const { data, status } = await ax.get(`users/${project}`);
      return { data, status };
    },
    async newUser(payload) {
      const { data, status } = await ax.post(`users/${project}`, payload);
      return { data, status };
    },
    async deleteUser(user) {
      const { data, status } = await ax.delete(`users/${project}/${user._id}`);
      return { data, status };
    },
    async fetchUser(uid) {
      const { data, status } = await ax.get(`users/${project}/${uid}`);
      return { data, status };
    },
  }),
  AccessControl(project) {
    return {
      async getAccessConfig(collection) {
        const { data, status } = await ax.get(
          `collections/${project}/access-config/${collection}`
        );
        return { data, status };
      },
      async resetConfig(collection) {
        let url = `collections/${project}/access-config/${collection}`;
        const { data, status } = await ax.delete(url);
        return { data, status };
      },
      async updateConfig(collection, config) {
        const { data, status } = await ax.post(
          `collections/${project}/access-config/${collection}`,
          config
        );
        return { data, status };
      },
    };
  },
};
