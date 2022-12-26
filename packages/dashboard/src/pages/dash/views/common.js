import { reactive } from "vue";
import { Api } from "../../../lib/api.js";

const projects = reactive({
  fetching: false,
  data: null,
});

export function useProjects(refetch) {
  if (!projects.data || refetch) {
    projects.fetching = true;
    Api.Projects.list()
      .then((res) => {
        projects.data = res.data;
      })
      .finally(() => {
        projects.fetching = false;
      });
  }
  return projects;
}
