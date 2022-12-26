# Todo App
A simple todo application build with vue.js and [NeoBase](https://github.com/asheghi/NeoBase) as back-end.

deployed on github, [demo](https://asheghi.github.io/TodoApp/)
## Features
 - [x] Authentication
 - [x] Access Control
 - [x] Create, Read, Update, Delete todos.

### How to Run 
1. login to NeoBase and create a new project, for example `TodoApp`.
2. create a `.env` file at the root of this project.
3. add your NeoBase instance base url and project name to `.env` file
```shell
VITE_NB_BASE_URL=http://localhost:7585/api/
VITE_NB_PROJECT=TodoApp
```
4. install dependencies
```shell
npm install
```
5. run development server
```shell
npm run dev
```
