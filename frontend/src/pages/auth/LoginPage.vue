<template>
  <div class="LoginPage">
    <div class="cover">
      <div class="header">
        <img :src="logoImage" width="120" height="120"/>
        <h1 class="text-2xl text-center opacity-60">
          <span class="">Login to</span>
          Wild Fire</h1>
      </div>

      <div class="form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" name="email" v-model="form.email" placeholder="john@doe.com">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="form.password" placeholder="secure password">
        </div>
        <button @click="submit" class="">
          Sign in
        </button>
      </div>

      <div class="msg opacity-75 ">
        <p>New here?
          <router-link class="text-blue-700 font-bold" to="/register">Register Here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import logoImage from '../../assets/logo.png?url'
import {ax} from "../../plugins/axios";
import {Api} from "../../lib/api";

export default {
  name: "LoginPage",
  data() {
    return {
      logoImage,
      form: {
        email: '',
        password: "",
      }
    }
  },
  methods: {
    async submit() {
      const {data} = await Api.login(this.form);
      localStorage.setItem('x-account-token', data.token);
      await this.$router.replace('/dash')
    }
  }
}
</script>

<style lang="scss">
.LoginPage {
  @apply min-h-screen flex justify-center items-center;
  .cover {
    @apply flex flex-col justify-center items-center gap-7;
    .header {
      @apply flex justify-center flex-col gap-4 items-center py-4;
    }

    .form-group {
      @apply flex flex-col justify-start gap-2 ;
      label {
        min-width: 80px;
        opacity: .5;
      }

      input {
        @apply px-4 py-2 rounded bg-gray-100 outline-blue-600;
      }

    }

    button {
      @apply px-4 w-full focus:bg-blue-700 active:bg-blue-800 transition-all
      outline-0 py-2  active:bg-blue-800 mt-4 rounded text-white bg-blue-600 font-bold;
    }
  }
}

</style>
