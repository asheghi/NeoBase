<template>
  <div class="User">
    User<br />
    <pre :key="$route.params.uid">{{ JSON.stringify(user, null, "\t") }}</pre>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { Api } from "../../../../lib/api";
import { onMounted, ref } from "vue";

export default {
  name: "User",
  beforeRouteUpdate() {
    this.fetchUser();
  },
  setup() {
    const route = useRoute();
    const project = route.params.project;
    const api = Api.Users(project);
    const user = ref();
    const fetchUser = async () => {
      const uid = route.params.uid;
      const { data } = await api.fetchUser(uid);
      user.value = data;
    };
    onMounted(() => {
      fetchUser();
    });
    return {
      project,
      api,
      fetchUser,
      user,
    };
  },
};
</script>

<style lang="scss">
.User {
  @apply absolute inset-0;
}
</style>
