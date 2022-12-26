this client is an abstraction over our REST APIs,
you can learn more about each method in its corresponding API document.

## Getting Started
it's extremely easy to start working with NeoBase via this client.

#### Create Project

if you haven't registered, create your account at [register](https://neobase.uk/register) page. when you're logged in
navigate to [dashboard](https://neobase.uk/register), click on "New Project" and enter your project name.

note: project names are unique, so try another one if it was already taken.

## Install Client

to add client on existing project just run the following command to add client to your project dependencies.

```bash
npm i --save @neobase/client
```

//todo add umd import

## Client Object

import `getClient` function into your code and create the client object with your **Project Name** and NeoBase server.

```js
//esm
import getClient from '@neobase/client';
//commonjs
const getClient = require('@neobase/client')

const client = getClient('project-name', {baseUrl: 'http://de.neobase.uk/api'})
```

## Collection CRUD

Collection object is an interface to interact with your Database Collection at NeoBase, it is used for creating,
reading, updating, and deleting documents.

```js
const Todos = client.Collection('collection');
```

### Create

create new document in collection.

**Example**: `create a new todo item`

```js
const {data: todo} = await Todos.create({task: 'read the docs', done: false});
console.log(todo);
/*
{
	"_id": "62d6b5...37d0e0",
	"task": "read the docs",
	"done": false,
	"createdAt": "...",
	"updatedAt": "...",
}
*/
```

### Find
syntax: 
```js
Collection.find(filter,projection,options:{skip,limit,sort}) : Promise
```

used to fetch an array of documents of collection. it calls `find` API.

**Example**: `get all todos`

```js
const todos = await Todos.find().exec();
```

**note**: find() is a chainable method and to execute query you must call `.exec()` at then end of chain.

#### Filtering

just like MongoDB's `db.colleciton.find` method, to filter documents pass a filter object.

**Example**: `find todos with status done === true`

```js
const todos = await Todos.find({done: true}).exec();
```

#### Projection

select fields you want to be returned.

**Example**: `get only name of todos`

```js 
const todoNames = await Todos.find().projection('-_id name').exec();
```

**note**: in mongodb `_id` field is always selected in documents by default, so we need to pass `-_id` in project to not
include it.

#### Limit, Skip

used for paginating documents.
`limit` determines how many documents will be returned.
`skip` determines how many documents will be skipped in query.

```js
const page1 = await Todos.find().limit(10).exec();
const page2 = await Todos.find().limit(10).skip(10).exec();
const page3 = await Todos.find().limit(10).skip(20).exec();
```

#### Sort

used to sort returning document based on one or more fields.

**Example**: `get todos sorted by created date in descending order`

```js
const sortedTodos = await Todos.find().sort({created_at: -1}).exec();
```

#### Populate

replace ObjectId with document in other collection.

**Example**: `get todo with name of its asignees`

```js
const populatedTodos = await Todos.find().populate({
  path: 'assigned_to',// the field that holds _id of asignees
  model: 'person', // the name of asynee collection
  // you can also add extra populate arguments
}) 
```

read more about MongoDB queries in [here](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/)

### FindOne
syntax:
```js
Collection.findOne(filter,projection): Promise
```

gets a single document from collection.

#### Filter

**Example** `get a todo with id of 'asdfasdf'`

```js
const {data: todo} = Todos.findOne({_id: 'adsfadsf'}).exec();
console.log(todo); // { _id: '...', name: '...', ...}
```

#### Projection

select fields you want to be returned.

**Example**: `get only name and status of todo with code 21`

```js 
const {data: todo} = await Todos.findOne({code: 21}).projection('-_id name done').exec();
console.log(todo); // { name: '...', done: ... }
```

### Count
syntax: 
```js
Collection.count(filter) : Promise
```

Count documents inside the collection matching passed filter.
**Example** `get count of all todos`

```js
const {data: count} = await Todos.count();
console.log(count) //20 
```

#### Filter

**Example** `get count of all todos which are done`

```js
const {data: count} = await Todos.count({done: true});
console.log(count) //10 
```

### Update
syntax: `Collection.update(filter,update) : Promise`

updates a document in collection.

**Example**: `set status of a task to done`

```js
const {data: result} = await Todos.update({_id: 'id-of-todo'}, {$set: {done: true}})
```

### DeleteOne
syntax: `Collection.deleteOne(filter) : Promise`

deletes only one document in collection.

**Example**: `delete one task with status done === true`
```js
const {data: result} = await Todos.deleteOne({done: true});
```


### DeleteMany
syntax: `Collection.deleteMany(filter) : Promise`

deletes every document matching its filter.

**Example**: `delete all todos`
```js
const {data: result} = await Todos.deleteMany();
```

**Example**: `delete all todos with status done === true`
```js
const {data: result} = await Todos.deleteMany({done: true});
```

## Authentication

### register
register new users for project. it returns a `token` which is used for authorization.

you need to store this token, and return this token via a function that is passed as `getToken`
option in client options.
```js
const {data} = await client.Auth.register({email:'...', password:'...'})
```

### Login
Authenticate user of your project. it returns a `token` which is used for authorization.

you need to store this token, and return this token via a function that is passed as `getToken`
option in client options.

```js
const {data} = await client.Auth.login({email:'...', password:'...'})
```
