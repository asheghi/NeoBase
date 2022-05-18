import {ax} from "../plugins/axios";

export const Api = {
  Projects: {
    async create(payload) {
      const {data, status} = await ax.post('projects', payload);
      return {data, status};
    },
    async list() {
      const {data, status} = await ax.get('projects');
      return {data, status};
    },
    async delete(name) {
      const {data, status} = await ax.delete('projects/' + name);
      return {data, status};
    },
  },
  Collections: (project) => ({
    async create(payload) {
      const {data, status} = await ax.post('collections/' + project, payload);
      return {data, status};
    },
    async list() {
      const {data, status} = await ax.get('collections/' + project);
      return {data, status};
    },
    async delete(name) {
      const {data, status} = await ax.delete('collections/' + project + '/' + name);
      return {data, status};
    },
    async saveAccessConfig(collection,payload){
      const {data, status} = await ax.post('collections/' + project + '/access-config/' + name);
      return {data, status};
    },
    async getAccessConfig(collection){
      const {data, status} = await ax.post('collections/' + project + '/access-config/' + name);
      return {data, status};
    }
  }),
  async login(payload) {
    const {data, status} = await ax.post('accounts/login', payload);
    return {data, status};
  },
  async register(payload) {
    const {data, status} = await ax.post('accounts/register', payload);
    return {data, status};
  },
  async me() {
    const {data, status} = await ax.get('accounts/me');
    return {data, status};
  },

  Documents(project, collection) {
    return {
      async create(payload) {
        const {data, status} = await ax.post(`documents/${project}/${collection}/create`, payload);
        return {data, status};
      },
      async find({params} = {}) {
        const {data, status} = await ax.get(`documents/${project}/${collection}/find`,{params});
        return {data, status};
      },
      async findOne({params} = {}) {
        const {data, status} = await ax.get(`documents/${project}/${collection}/findOne`,{params});
        return {data, status};
      },
      async count() {
        const {data, status} = await ax.get(`documents/${project}/${collection}/count`);
        return {data, status};
      },
      async deleteOne(payload) {
        const {data, status} = await ax.post(`documents/${project}/${collection}`,payload);
        return {data, status};
      },
    };
  }
}
