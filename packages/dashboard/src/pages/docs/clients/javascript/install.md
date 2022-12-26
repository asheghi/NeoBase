
### usage:
to use this package you will need a NeoBase account, create a new project and that's all.

0.create a NeoBase account at [neobase.uk](https://neobase.uk)

1.create a project in NeoBase dashboard

2.install js client on your project
```bash
npm i --save @neobase/client
```

3.create a client object with your credentials.
```js
//esm
import getClient from '@neobase/client';
//commonjs
const getClient = require('@neobase/client')

const client = getClient('project-name',{ baseUrl : 'http://de.neobase.uk/api'})
```

4.create collection
```js
const Todos = client.Collection('collection-name');
```

5.you create, read, update and data through each Collection object.

## APIs
### FIND
fetch documents of each collection.
