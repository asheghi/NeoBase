<template>
  <nav class="NavBar container mx-auto">
    <router-link to="/" class="brand">
      <div class="logo">
        <IconServer width="22" height="22" />
      </div>
      <h2 class="name">NeoBase</h2>
    </router-link>
    <div class="end">
      <ul class="nav-links">
        <li>
          <router-link to="/why">Why NeoBase</router-link>
        </li>
        <li>
          <router-link to="/updated">Updates</router-link>
        </li>
        <li class="docs">
          <router-link to="/docs">Documentations</router-link>
        </li>
      </ul>
      <div class="light-switch">
        <button @click="toggleDarkMode">
          <component
            :is="isDarkMode ? IconLightMode : IconDarkMode"
            class="toggle"
            width="28"
            height="28"
          />
        </button>
      </div>
      <a target="_blank" href="https://github.com/asheghi/neobase">
        <IconGithub width="28" height="28" />
      </a>
      <button class="menu" @click="toggleExpanded">
        <div class="line" />
        <div class="line" />
        <div class="line" />
      </button>
    </div>
  </nav>
  <div class="NavDrawer" :class="{ expanded }">
    <div class="bg-shadow" @click="toggleExpanded"></div>
    <div class="slider content">
      <div class="header">
        <router-link to="/">
          <div class="brand">
            <div class="logo">
              <IconServer width="22" height="22" />
            </div>
            <h2 class="name">NeoBase</h2>
          </div>
        </router-link>
        <button class="close" @click="toggleExpanded">
          <IconClose />
        </button>
      </div>
      <ul class="links">
        <li>
          <router-link to="/why">Why NeoBase</router-link>
        </li>
        <li>
          <router-link to="/updates">Updates</router-link>
        </li>
        <li>
          <router-link to="/roadmap">RoadMap</router-link>
        </li>
        <li>
          <router-link to="/release-notes">ReleaseNotes</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import IconServer from "ionicons/dist/svg/server.svg";
import IconDarkMode from "ionicons/dist/svg/moon-sharp.svg";
import IconLightMode from "ionicons/dist/svg/sunny.svg";
import { isDarkMode, toggleDarkMode } from "../../../lib/theme";
import IconClose from "ionicons/dist/svg/close.svg";
import IconGithub from "ionicons/dist/svg/logo-github.svg";
import { ref } from "vue";
const expanded = ref(false);
const toggleExpanded = () => (expanded.value = !expanded.value);
</script>

<script>
export default {
  name: "NavBar",
};
</script>
<style lang="scss">
.NavBar {
  height: 85px!important;
  z-index: 50;
  @apply flex justify-between p-6 h-full;
  .brand {
    @apply flex gap-1 items-center h-full;
    .logo {
      @apply bg-primary-600 p-1 rounded;
      svg {
        @apply fill-white;
      }
    }
    .name {
      @apply text-2xl font-extrabold text-transparent
      bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400;
    }
  }
  .end {
    @apply flex items-center gap-4;
    svg {
      @apply fill-gray-500 dark:fill-gray-300;
    }
    .light-switch {
      @apply flex gap-2 items-center h-full;
    }
    .menu {
      width: 28px;
      height: 21px;
      @apply flex flex-col justify-between md:hidden;
      .line {
        height: 3px;
        @apply bg-gray-500 w-full dark:bg-gray-300;
      }
    }
    .nav-links {
      @apply hidden md:flex flex-row gap-2 items-center;
      li {
        a {
          @apply px-2 py-2  font-bold text-primary-800 dark:text-white;
        }
        &.docs {
          a {
            @apply bg-primary-500 text-white shadow;
          }
        }
      }
    }
  }
}
.NavDrawer {
  z-index: 100;
  @apply md:hidden fixed inset-y-0;
  transition: all ease-out 360ms;
  width: 100vw;
  left: 100vw;
  &.expanded {
    transition: all ease-out 560ms;
    left: 0;
  }
  .bg-shadow {
    @apply absolute inset-0;
    z-index: 0;
  }
  .slider {
    @apply absolute inset-y-0 right-0 bg-white dark:bg-gray-700
    border-l border-gray-200 shadow-2xl dark:border-gray-600;
    width: 300px;
    .header {
      @apply absolute top-0 right-0 p-4 flex justify-between
      text-primary-400 fill-primary-400 dark:fill-white dark:text-white
      font-extrabold
      w-full items-center;
      height: 76px;
      .brand {
        @apply flex gap-1;
      }
      .logo {
        @apply fill-primary-400 dark:fill-white;
      }
    }
    .links {
      padding-top: 76px;
      @apply px-4 flex flex-col gap-4;
      li {
        a {
          @apply font-light hover:text-primary dark:hover:text-primary-300;
        }
      }
    }
  }
}
</style>
