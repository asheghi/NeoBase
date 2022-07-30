<template>
  <div class="DocumentsPage">
    <nav-bar />
    <div class="cover">
      <div class="side-bar">
        <template v-for="it in docs">
          <h3
            v-if="!it.page"
            :key="it.name"
            class="opacity-50 font-normal text-sm "
            :class="'level-' + it.level"
            v-text="it.name"
          ></h3>
          <router-link
            v-if="it.page"
            :key="it.path"
            class="item"
            :to="{ name: 'docs-' + it.path }"
            :class="'level-' + it.level"
          >
            {{ it.name }}
          </router-link>
        </template>
      </div>
      <div class="content cover-router-view prose">
        <router-view v-slot="{ Component }">
          <transition class="" name="fade">
            <div>
              <component :is="Component" class="doc-content routed-view" />
              <div v-if="doc_level > 0" class="navigation">
                <div v-if="prev_doc" class="previous">
                  <h3>Previous</h3>
                  <DocLinkCard :doc="prev_doc" />
                </div>
                <div v-if="next_doc" class="next">
                  <h3>Next</h3>
                  <DocLinkCard :doc="next_doc" />
                </div>
              </div>
            </div>
          </transition>
        </router-view>
      </div>
      <div v-if="showTableOfContent" class="table-of-content">
        <div class="text-gray-500 uppercase font-bold text-xs">
          on this page
        </div>
        <router-link
          v-for="(it, index) in tableOfContent"
          :key="index"
          class="item"
          :to="{ name: doc_name, hash: '#' + it.id }"
          :class="it.type"
        >
          {{ it.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import "highlight.js/styles/intellij-light.css";
import NavBar from "../index/views/NavBar.vue";
import { sideBarItems as docs } from "../../routes";
import { useRoute, useRouter } from "vue-router";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import DocLinkCard from "./DocLinkCard.vue";
const router = useRouter();
const route = useRoute() || { meta: {} };
const doc_name = computed(() => route.name);
const doc_level = computed(() => route.meta.level);
const showTableOfContent = computed(() => !route.meta.hideToC);
const doc_index = computed(() =>
  docs.findIndex((it) => doc_name.value === "docs-" + it.path)
);
const prev_doc = computed(() => {
  if (doc_index.value < 1) return null;
  return docs
    .slice(0, doc_index.value)
    .reverse()
    .find((it) => it.page && it.level);
});

const next_doc = computed(() => {
  return docs
    .slice(doc_index.value + 1, docs.length)
    .find((it) => it.page && it.level);
});
const tableOfContent = ref([]);
watch(
  () => doc_name.value,
  (n, o) => {
    nextTick(() => {
      tableOfContent.value = getTableOfContent();
    });
  }
);

onMounted(async () => {
  tableOfContent.value = getTableOfContent();
  try {
    const it = await import("highlight.js");
    const highlight = it.default || it;
    highlight.highlightAll();
  } catch (e) {
    console.error(e);
  }
  const anchor = document.querySelector(route.hash);
  if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
});

function getTableOfContent() {
  const matches = document.querySelectorAll(
    ".doc-content h1, .doc-content h2 , .doc-content h3"
  );
  const list = [];
  matches.forEach((el) => {
    if (!el.id) el.id = getUniqueIdForEl(el);
    const id = el.id;
    const a = document.createElement("a");
    a.href = router.resolve({ name: route.name, hash: "#" + id }).href;
    a.id = id;
    a.innerHTML = el.outerHTML;
    el.outerHTML = a.outerHTML;
    el.id = "";

    list.push({
      name: el.innerText,
      type: el.tagName,
      id,
    });
  });
  return list;
}
</script>

<script>
function getUniqueIdForEl(el, counter = 0) {
  if (el.id) return el.id;
  const text = el.innerText;
  if (document.getElementById(text + "-" + counter)) {
    return getUniqueIdForEl(el, ++counter);
  }
  if (!counter) return text.replaceAll(" ", "-");
  return text.replaceAll(" ", "-") + "-" + counter;
}

export default {
  name: "DocumentsPage",
};
</script>

<style lang="scss">
.DocumentsPage {
  .cover {
    @apply flex container mx-auto gap-4 px-6;
    .side-bar {
      @apply hidden md:flex min-w-[240px] flex-col gap-1;
      .item {
        @apply px-2 py-1 font-normal
        capitalize text-sm no-underline;
        text-decoration: none;
        &:hover {
          @apply text-primary-300;
        }
        &.router-link-active {
          @apply text-primary dark:text-primary-300;
        }
      }
      .level-0 {
        @apply pl-2;
      }
      .level-1 {
        @apply pl-2 mt-2;
      }
      .level-2 {
        @apply pl-4;
      }
    }
    .content {
      @apply w-full xl:min-w-[800px] self-stretch dark:text-white;
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      strong,
      a,
      code {
        @apply dark:text-white;
      }
      a {
        @apply no-underline text-primary font-bold;
      }
      pre {
        @apply bg-transparent p-0 rounded;
        code {
          * {
            font-family: "JetBrains Mono", monospace !important;
          }

          @apply bg-gray-50 dark:bg-gray-600 border border-gray-200
        text-gray-600 opacity-100;

          &.language-bash,
          &.language-js {
            @apply font-normal border border-gray-200 dark:border-gray-500 px-4 py-2;
          }
          &.language-bash {
          }
        }
        &::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
      code,
      p {
        @apply max-w-[100vw] overflow-x-auto;
      }
      p > code {
        @apply inline;
      }
      table {
        @apply max-w-[100vw] overflow-x-auto block;
        thead {
          tr {
            th {
              @apply whitespace-nowrap dark:text-white;
            }
          }
        }
      }

      .navigation {
        @apply flex flex-col w-full mx-auto gap-4 pb-8 pt-4 px-4
          md:flex-row md:gap-6;
        .next,
        .previous {
          @apply flex-1 max-w-[400px];
        }
        a {
          @apply block;
        }
      }
      max-width: 100vw;
    }
    .table-of-content {
      @apply hidden sticky lg:flex flex-col gap-1 min-w-[240px] max-w-[240px];
      .item {
        @apply block py-1;

        &.H2 {
          @apply pl-2;
        }
        &.H3 {
          @apply pl-4;
        }
      }
      .item:nth-child(2) {
        @apply pl-0;
      }
      @apply top-4;
      height: fit-content;
    }
  }

  .prose :where(code):not(:where([class~="not-prose"] *))::before {
    content: "";
  }
  .prose :where(code):not(:where([class~="not-prose"] *))::after {
    content: "";
  }
  .prose code {
    @apply font-normal bg-gray-200 px-1 py-1  dark:text-white dark:bg-gray-500;
  }
}
.dark {
  .DocumentsPage {
    @import "highlight.js/scss/github-dark";
    .hljs-comment {
      @apply text-gray-300;
    }
    .hljs-property {
      @apply text-purple-400;
    }
  }
}
</style>
