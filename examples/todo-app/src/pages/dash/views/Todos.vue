<template>
  <div class="Todos">
    <div class="form">
      <div :class="{ 'skeleton-box': creating }" class="w-full">
        <input
          id="todo"
          v-model="newTask"
          :disabled="creating"
          type="text"
          name="todo"
          placeholder="yet another task"
          @keydown.enter="createTask"
        />
      </div>
      <button :disabled="creating" @click="createTask">Add Todo</button>
    </div>
    <div class="list">
      <template v-if="!fetching">
        <div
          v-for="task in todos"
          :key="task._id"
          class="item"
          :class="{
            done: task.done,
            'skeleton-box': loading[task._id],
            loading: loading[task._id],
          }"
        >
          <input
            :disabled="loading[task._id]"
            :checked="task.done"
            type="checkbox"
            @click="toggleDone(task)"
          />
          <div class="name" v-text="task.name"></div>
          <button class="remove" @click="removeTodo(task)">Delete</button>
        </div>
      </template>
      <template v-if="fetching">
        <div class="fetching">Fetching Data...</div>
      </template>
    </div>

    <div v-if="count != null" class="count">Tasks: {{ count }}</div>
  </div>
</template>
<script>
import { Todos } from "../../../lib/client";

export default {
  name: "Todos",
  data() {
    return {
      todos: [],
      newTask: "",
      count: null,
      fetching: null,
      loading: {},
      creating: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.fetching = true;
      try {
        const { data } = await Todos.find().sort({ createdAt: -1 }).exec();
        this.todos = data;
        await this.fetchCount();
      } catch (e) {
        console.error(e);
      } finally {
        this.fetching = false;
      }
    },
    async createTask() {
      try {
        this.creating = true;
        const { data } = await Todos.create({
          name: this.newTask,
          done: false,
        });
        this.todos.splice(0, 0, data);
        this.newTask = "";
        this.fetchCount();
      } catch (e) {
        console.error(e);
      } finally {
        this.creating = false;
        await this.$nextTick();
        document.querySelector(".form input").focus();
      }
    },
    async removeTodo(task) {
      try {
        this.loading[task._id] = true;
        await Todos.deleteOne({ _id: task._id });
        const index = this.todos.findIndex((it) => it._id === task._id);
        this.todos.splice(index, 1);
        await this.fetchCount();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading[task._id] = false;
      }
    },
    //update task
    async toggleDone(task) {
      this.loading[task._id] = true;
      try {
        await Todos.updateOne({ _id: task._id }, { ...task, done: !task.done });
        const { data: updatedTask } = await Todos.findOne({
          _id: task._id,
        }).exec();
        const index = this.todos.findIndex((it) => it._id === task._id);
        this.todos.splice(index, 1);
        this.todos.splice(index, 0, updatedTask);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading[task._id] = false;
      }
    },
    async fetchCount() {
      const { data } = await Todos.count();
      this.count = data;
    },
  },
};
</script>
<style lang="scss">
.Todos {
  @apply px-4;
  .item {
    @apply text-lg  text-gray-700 flex px-2 items-center gap-2 w-full py-2 rounded
    hover:bg-gray-200 transition my-2;
    .remove {
      @apply ml-auto bg-red-400 text-white px-2 py-1 text-sm rounded;
    }

    input[type="checkbox"] {
      @apply w-4 h-4;
    }

    &.done {
      @apply text-gray-500 line-through;
    }

    &.loading {
      @apply cursor-progress;
    }
  }

  .list {
    .fetching {
      @apply w-full py-16 flex justify-center items-center opacity-75;
    }
  }

  .form {
    @apply flex w-full gap-2;
    input {
      @apply bg-transparent w-full border outline-blue-600 border-gray-200 px-2 py-1;
    }

    button {
      @apply whitespace-nowrap bg-blue-500 text-white rounded px-2 py-1;
    }
  }

  .count {
    @apply w-full py-16 flex justify-center items-center;
  }

  .skeleton-box {
    position: relative;
    overflow: hidden;
    background-color: #dddbdd;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(#fff, 0) 0,
        rgba(#fff, 0.2) 20%,
        rgba(#fff, 0.5) 60%,
        rgba(#fff, 0)
      );
      animation: shimmer 2s infinite;
      content: "";
    }

    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  }
}
</style>
