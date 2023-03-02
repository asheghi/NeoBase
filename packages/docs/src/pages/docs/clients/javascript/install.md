
### usage:
1.start the NeoBase back-end

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

const client = getClient('project-name',{ baseUrl : 'http://localhost:8080/api'})
```

4.create collection
```js
const Todos = client.Collection('collection-name');
```

5.you can create, read, update and delete data through each Collection object.