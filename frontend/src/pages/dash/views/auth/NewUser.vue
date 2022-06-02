<template>
  <div class="NewUser">
    <div class="form" @keydown.enter="submit">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          name="email"
          type="email"
          placeholder="enter your email address"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          name="password"
          type="password"
          placeholder="enter a secure password"
        />
      </div>
      <button class="btn" @click="submit">Submit</button>
    </div>
  </div>
</template>
<script>
import { useRoute } from "vue-router";
import { Api } from "../../../../lib/api";

export default {
  name: "NewUser",
emits: ['created'],
  setup() {
    let route = useRoute();
    const project = route.params.project;
    const api = Api.Users(project);
    return {
      api,
      project,
    };
  },
  data() {
    return {
      form: {},
    };
  },
  methods: {
    async submit() {
      const payload = this.form;
      const { data, status } = await this.api.newUser(payload);
      console.log('check', data);
      this.$emit("created", data);
    },
  },
};
</script>
