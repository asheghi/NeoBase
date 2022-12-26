# NeoBase Client

Javascript client for [neobase](https://neobase.ir)

### install

```bash
npm i @neobase/client
```

### Usage

First get your project name from [NeoBase](https://neobase.ir), if you don't have a project yet, register and create one, it's free!

_note_ make sure to set your access config in NeoBase dashboard and read authentication docs below.

### Actual Usage

```javascript
import { getClient } from '@neobase/client'

const client = getClient('your-project-name', { baseurl: 'https://neobase.darkube.app/api' })

//create collection object
const Todos = client.Collection('todos')
const Animals = client.Collection('animals')

// *note* the apis is very close to [Mongoose](https://mongoosejs.com/)

//create a document
const { data, status } = await Todos.create({ name: 'update the docs', done: false })

//count all documents
await Todos.count()

//count with filters!
await Todos.count({ status: 'done' })

//fetch all documents
const { data, status } = await Todos.find()

//find options
await Todos
  //filter documents
  .find({ foo: 'bar' })
  //pagination
  .limit(85)
  .skip(65)
  //sorting
  .sort('createdAt')
  //select fields
  .projection({ name: 1 })
  // array of mongoose populate arguments
  .populate([{ model: 'users', path: 'createdBy' }])

// if you don't like chains
const res = await Todos.find(
  { foo: 'bar' },
  { _id: -1 },
  {
    sort: 'age',
    limit: 85,
    skip: 65
  }
)

//update
await Todos.updateOne({ _id: 1 }, { $set: { done: true } })

//delete all documents in a collection!
await Todos.deleteMany()

//delete finished tasks
await Todos.deleteMany({ done: true })

//delete single document
await Todos.deleteOne({ _id: 4 })
```

### Authentication

NeoBase use JsonWebToken for authentication, after authentication(login/register) a token is returned, save the token and send the token with each request as `x-auth-token` header;

```javascript
function getToken(){
    //fetch token
   return  localStorage.setItem('auth-token', token);
}

// pass the get token as option
const client = getClient('name',{..., getToken});

//authenticate
const { data, status } = await client.Auth.register({
  email: 'valid@mail.com',
  password: 'super-secure'
})

// or login
const { data, status } = await client.Auth.login({
  email: 'valid@mail.com',
  password: 'super-secure'
})

//get the token
const { token } = data;

//save your token
localstorage.setItem('auth-token',token);

// now every request will be authenticated
// check your session
const {data,status} = await client.Auth.me()

```

_note_ to check exipration date you can use jwt libraries.

### Documents

Please read NeoBase documents at [Docs](https://neobase.ir/docs).
