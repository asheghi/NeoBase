<template>
  <nav class="DashNavBar">
    <div class="hidden lg:flex">
      <NButton
        class="gap-2 px-0 mr-4"
        @click="$router.push({ name: 'projects' })"
      >
        <IconLogo />
        NeoBase
      </NButton>
    </div>
    <div class="lg:hidden">
      <NButton class="square" @click="expanded = !expanded">
        <IconMenu />
      </NButton>
    </div>
    <div class="title" v-text="title"></div>

    <span class="ml-auto"></span>
    <NButton
      v-if="$route.name !== 'projects'"
      class="projects"
      @click="projectsDropped = !projectsDropped"
    >
      {{ $route.params?.project }}
      <div
        v-if="!project.fetching"
        :class="{ block: projectsDropped, hidden: !projectsDropped }"
        class="drop-down"
      >
        <NButton
          v-for="p in projects.data?.filter(
            (it) => it.name !== $route.params.project
          )"
          :key="p._id"
          class="item"
          @click.prevent.stop="onProjectSelected(p.name)"
        >
          {{ p.name }}
        </NButton>
      </div>
    </NButton>
    <NButton class="square" @click="toggleDarkMode">
      <component
        :is="isDarkMode ? IconLightMode : IconDarkMode"
        class="toggle"
        width="28"
        height="28"
      />
    </NButton>
    <NButton class="square">
      <IconNotifications />
    </NButton>
    <NButton class="square">
      <IconAccount />
    </NButton>
    <div class="nav-drawer" :class="{ expanded, 'hide-nav': !project }">
      <div class="flex lg:hidden mb-6">
        <NButton class="gap-2 px-0">
          <IconLogo />
          NeoBase
        </NButton>
      </div>
      <div v-if="project" class="links">
        <router-link
          v-for="(tab, index) in sidebarItems"
          :key="index"
          class="item"
          :to="tab.to"
          @click="expanded = false"
        >
          <component :is="tab.icon" v-if="tab.icon" class="icon" />
          <div class="label" v-text="tab.label" />
        </router-link>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="expanded"
        class="nav-drawer-shadow lg:hidden"
        @click="expanded = false"
      ></div>
    </transition>
  </nav>
</template>
<script setup>
import IconDarkMode from "ionicons/dist/svg/moon-sharp.svg";
import IconLightMode from "ionicons/dist/svg/sunny.svg";
import { isDarkMode, toggleDarkMode } from "../../../../lib/theme";
import { sidebarItems } from "./sidebar-items.js";
import { useProjects } from "../common.js";
const projects = useProjects();
</script>
<script>
import IconMenu from "@mdi/svg/svg/menu.svg";
import IconNotifications from "@mdi/svg/svg/bell.svg";
import IconAccount from "@mdi/svg/svg/account.svg";
import NButton from "../../../../components/design-system/N-Button.vue";
import IconLogo from "../../../../assets/logo-color.svg";
export default {
  name: "DashNavBar",
  components: {
    NButton,
    IconMenu,
    IconNotifications,
    IconAccount,
    IconLogo,
  },
  data() {
    return {
      expanded: false,
      projectsDropped: false,
    };
  },
  computed: {
    title() {
      return this.$route.name;
    },
    project() {
      return this.$route.params.project;
    },
  },
  methods: {
    onProjectSelected(projectName) {
      this.projectsDropped = !this.projectsDropped;
      this.$router.push({
        name: this.$route.name,
        params: { ...(this.$route?.params || {}), project: projectName },
        query: this.$route.query,
      });
    },
  },
};
</script>
<style lang="scss">
.DashNavBar {
  @apply fixed inset-x-0 top-0 flex px-2 py-2 items-center justify-between
  bg-white border-b border-gray-300 dark:border-gray-500 z-10;
  height: var(--nav-height);
  transition: all linear 240ms;

  @apply fill-primary-700;
  svg {
    path {
      width: 24px !important;
      height: 24px !important;
    }
  }

  .nav-drawer {
    @apply fixed bg-white inset-y-0 z-50 py-4;
    width: var(--side-width);
    transition: all ease 350ms;
    left: -100%;
    &.expanded {
      @apply left-0;
    }
    @screen lg {
      @apply left-0 border-r border-gray-300 dark:border-gray-500;
      top: var(--nav-height);
    }
    &.hide-nav {
      @apply hidden;
    }
    .links {
      @apply flex flex-col gap-2;
      .item {
        @apply flex gap-4 transition-all items-center px-4 py-2;
        .icon {
          @apply dark:fill-white fill-gray-500 rounded;
        }
        &.router-link-active {
          @apply bg-gray-200 text-primary-500 dark:bg-gray-500 dark:text-white;
          .icon {
            @apply fill-primary-500 dark:fill-primary-200;
          }
        }
        &:hover,
        &:focus {
        }
      }
    }
  }
  .nav-drawer-shadow {
    @apply bg-black opacity-25 fixed inset-0 z-0;
  }
  .title {
    @apply capitalize;
  }
  .projects {
    @apply relative min-w-[140px];
    .drop-down {
      @apply absolute bg-gray-200 dark:bg-gray-700 top-[120%];
      .item {
        @apply w-full px-4 py-2;
      }
    }
  }
}
.dark {
  .DashNavBar {
    @apply bg-gray-600 fill-white;
    .nav-drawer {
      @apply bg-gray-600;
    }
  }
}
</style>
