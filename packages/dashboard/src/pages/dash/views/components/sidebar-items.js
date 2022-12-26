import IconData from "@mdi/svg/svg/database.svg";
import IconUsers from "@mdi/svg/svg/account-group.svg";
import IconAccess from "@mdi/svg/svg/account-lock.svg";
import IconPlayground from "@mdi/svg/svg/gamepad.svg";
import { useRoute } from "vue-router";
import { computed } from "vue";
const route = useRoute();
const collection = computed(() => {
  if (route && route.params && route.params.collection) {
    return route.params.collection;
  }
  return null;
});
export const sidebarItems = computed(() => [
  {
    label: "Database",
    icon: IconData,
    to: (() => {
      if (collection.value)
        return { name: "documents", params: { collection: collection.value } };
      return { name: "collections" };
    })(),
  },
  {
    label: "Users",
    icon: IconUsers,
    to: { name: "auth" },
  },
  {
    label: "Access Control",
    icon: IconAccess,
    to: (() => {
      if (collection.value)
        return {
          name: "access-config",
          params: { collection: collection.value },
        };
      return { name: "access" };
    })(),
  },
  {
    label: "Playground",
    icon: IconPlayground,
    to: (() => {
      if (collection.value)
        return {
          name: "collection-playground",
          params: { collection: collection.value },
        };
      return { name: "playground" };
    })(),
  },
]);
