<template>
  <div class="HomePage">
    <NavBar />
    <div class="cover container mx-auto px-6">
      <div class="big-text">
        <h1 class="whitespace-nowrap">
          The
          <span class="supertext">SuperPowered </span>
          <br />
          Backend for developers
        </h1>
      </div>
      <div class="desc text-2xl leading-9 opacity-60">
        <p>
          NeoBase helps you build faster and scale further than any other
          Serverless Platform or App Framework. Just create a Project, and get a
          powerful Rest API & beautiful Management UI for content and data.
        </p>
        <p class="mt-8">
          No dev-ops or server – just elegant APIs to help you ship what that
          matters without sacrificing the flexibility or power of a bespoke
          back-end.
        </p>
      </div>
      <div class="access sm:flex justify-start gap-4 mt-16 text-lg">
        <input
          id="email"
          v-model="email"
          class=""
          placeholder="Enter your Email Address"
          type="email"
          name="email"
        />
        <router-link :to="'/register?' + 'email=' + email">
          Get started
          <ChevRight />
        </router-link>
      </div>
      <div class="login py-4 text-lg">
        <router-link class="text-primary dark:text-primary-300 font-bold" to="/login"> login </router-link>
        <span class="text-gray-500"> if you already have an account. </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import NavBar from "./views/NavBar.vue";
import ChevRight from "ionicons/dist/svg/chevron-forward.svg";
import { ref } from "vue";
const email = ref("");
</script>
<script>
export default {
  name: "HomePage",
};
</script>
<style lang="scss">
.HomePage {
  .cover {
    @apply flex flex-col justify-center mx-auto xl:px-64 pb-16;
    .big-text {
      @apply mt-16 text-4xl tracking-tighter md:text-6xl lg:text-6xl xl:text-7xl mb-8 text-gray-800 font-extrabold
      dark:text-white;
      line-height: 1.25;
    }
    .supertext {
      @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-300;
    }
    .desc {
      max-width: 49rem;
    }
    .access {
      @apply mx-auto sm:mx-0;
      max-width: 320px;
      input {
        @apply px-4 py-2 outline-primary-500 border-gray-100 border bg-gray-100
        dark:bg-gray-600 dark:border-gray-500 dark:text-white shadow dark:outline-white;
        min-width: 320px;
        max-width: 420px;
        transition: all ease 250ms;
        &:focus {
          @apply transform shadow-lg;
        }
      }
      a {
        @apply justify-center;
        @apply mt-4 w-full sm:mt-0 whitespace-nowrap w-auto outline-primary inline-block flex pl-5 rounded
        text-primary px-2 py-2  items-center gap-1
        dark:outline-primary-300 dark:text-primary-300 shadow border-primary-300;
        border-width: 1px !important;
        transition: all ease 250ms;
        &:hover,
        &:focus {
          @apply bg-primary-500 text-white fill-white transform scale-105 shadow-lg;
        }
      }
    }
  }
}
</style>
