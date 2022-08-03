import{H as o,o as t,c as n,f as s}from"./index.b7488eef.js";const a={class:"markdown-body"},c=s(`<p>this client is an abstraction over our REST APIs, you can learn more about each method in its corresponding API document.</p><h2>Getting Started</h2><p>it\u2019s extremely easy to start working with NeoBase via this client.</p><h4>Create Project</h4><p>if you haven\u2019t registered, create your account at <a href="https://neobase.uk/register">register</a> page. when you\u2019re logged in navigate to <a href="https://neobase.uk/register">dashboard</a>, click on \u201CNew Project\u201D and enter your project name.</p><p>note: project names are unique, so try another one if it was already taken.</p><h2>Install Client</h2><p>to add client on existing project just run the following command to add client to your project dependencies.</p><pre><code class="language-bash">npm i --save @neobase/client
</code></pre><p>//todo add umd import</p><h2>Client Object</h2><p>import <code class="">getClient</code> function into your code and create the client object with your <strong>Project Name</strong> and NeoBase server.</p><pre><code class="language-js">//esm
import getClient from &#39;@neobase/client&#39;;
//commonjs
const getClient = require(&#39;@neobase/client&#39;)

const client = getClient(&#39;project-name&#39;, {baseUrl: &#39;http://de.neobase.uk/api&#39;})
</code></pre><h2>Collection CRUD</h2><p>Collection object is an interface to interact with your Database Collection at NeoBase, it is used for creating, reading, updating, and deleting documents.</p><pre><code class="language-js">const Todos = client.Collection(&#39;collection&#39;);
</code></pre><h3>Create</h3><p>create new document in collection.</p><p><strong>Example</strong>: <code class="">create a new todo item</code></p><pre><code class="language-js">const {data: todo} = await Todos.create({task: &#39;read the docs&#39;, done: false});
console.log(todo);
/*
{
	&quot;_id&quot;: &quot;62d6b5...37d0e0&quot;,
	&quot;task&quot;: &quot;read the docs&quot;,
	&quot;done&quot;: false,
	&quot;createdAt&quot;: &quot;...&quot;,
	&quot;updatedAt&quot;: &quot;...&quot;,
}
*/
</code></pre><h3>Find</h3><p>syntax:</p><pre><code class="language-js">Collection.find(filter,projection,options:{skip,limit,sort}) : Promise
</code></pre><p>used to fetch an array of documents of collection. it calls <code class="">find</code> API.</p><p><strong>Example</strong>: <code class="">get all todos</code></p><pre><code class="language-js">const todos = await Todos.find().exec();
</code></pre><p><strong>note</strong>: find() is a chainable method and to execute query you must call <code class="">.exec()</code> at then end of chain.</p><h4>Filtering</h4><p>just like MongoDB\u2019s <code class="">db.colleciton.find</code> method, to filter documents pass a filter object.</p><p><strong>Example</strong>: <code class="">find todos with status done === true</code></p><pre><code class="language-js">const todos = await Todos.find({done: true}).exec();
</code></pre><h4>Projection</h4><p>select fields you want to be returned.</p><p><strong>Example</strong>: <code class="">get only name of todos</code></p><pre><code class="language-js">const todoNames = await Todos.find().projection(&#39;-_id name&#39;).exec();
</code></pre><p><strong>note</strong>: in mongodb <code class="">_id</code> field is always selected in documents by default, so we need to pass <code class="">-_id</code> in project to not include it.</p><h4>Limit, Skip</h4><p>used for paginating documents. <code class="">limit</code> determines how many documents will be returned. <code class="">skip</code> determines how many documents will be skipped in query.</p><pre><code class="language-js">const page1 = await Todos.find().limit(10).exec();
const page2 = await Todos.find().limit(10).skip(10).exec();
const page3 = await Todos.find().limit(10).skip(20).exec();
</code></pre><h4>Sort</h4><p>used to sort returning document based on one or more fields.</p><p><strong>Example</strong>: <code class="">get todos sorted by created date in descending order</code></p><pre><code class="language-js">const sortedTodos = await Todos.find().sort({created_at: -1}).exec();
</code></pre><h4>Populate</h4><p>replace ObjectId with document in other collection.</p><p><strong>Example</strong>: <code class="">get todo with name of its asignees</code></p><pre><code class="language-js">const populatedTodos = await Todos.find().populate({
  path: &#39;assigned_to&#39;,// the field that holds _id of asignees
  model: &#39;person&#39;, // the name of asynee collection
  // you can also add extra populate arguments
}) 
</code></pre><p>read more about MongoDB queries in <a href="https://www.mongodb.com/docs/manual/reference/method/db.collection.find/">here</a></p><h3>FindOne</h3><p>syntax:</p><pre><code class="language-js">Collection.findOne(filter,projection): Promise
</code></pre><p>gets a single document from collection.</p><h4>Filter</h4><p><strong>Example</strong> <code class="">get a todo with id of &#39;asdfasdf&#39;</code></p><pre><code class="language-js">const {data: todo} = Todos.findOne({_id: &#39;adsfadsf&#39;}).exec();
console.log(todo); // { _id: &#39;...&#39;, name: &#39;...&#39;, ...}
</code></pre><h4>Projection</h4><p>select fields you want to be returned.</p><p><strong>Example</strong>: <code class="">get only name and status of todo with code 21</code></p><pre><code class="language-js">const {data: todo} = await Todos.findOne({code: 21}).projection(&#39;-_id name done&#39;).exec();
console.log(todo); // { name: &#39;...&#39;, done: ... }
</code></pre><h3>Count</h3><p>syntax:</p><pre><code class="language-js">Collection.count(filter) : Promise
</code></pre><p>Count documents inside the collection matching passed filter. <strong>Example</strong> <code class="">get count of all todos</code></p><pre><code class="language-js">const {data: count} = await Todos.count();
console.log(count) //20 
</code></pre><h4>Filter</h4><p><strong>Example</strong> <code class="">get count of all todos which are done</code></p><pre><code class="language-js">const {data: count} = await Todos.count({done: true});
console.log(count) //10 
</code></pre><h3>Update</h3><p>syntax: <code class="">Collection.update(filter,update) : Promise</code></p><p>updates a document in collection.</p><p><strong>Example</strong>: <code class="">set status of a task to done</code></p><pre><code class="language-js">const {data: result} = await Todos.update({_id: &#39;id-of-todo&#39;}, {$set: {done: true}})
</code></pre><h3>DeleteOne</h3><p>syntax: <code class="">Collection.deleteOne(filter) : Promise</code></p><p>deletes only one document in collection.</p><p><strong>Example</strong>: <code class="">delete one task with status done === true</code></p><pre><code class="language-js">const {data: result} = await Todos.deleteOne({done: true});
</code></pre><h3>DeleteMany</h3><p>syntax: <code class="">Collection.deleteMany(filter) : Promise</code></p><p>deletes every document matching its filter.</p><p><strong>Example</strong>: <code class="">delete all todos</code></p><pre><code class="language-js">const {data: result} = await Todos.deleteMany();
</code></pre><p><strong>Example</strong>: <code class="">delete all todos with status done === true</code></p><pre><code class="language-js">const {data: result} = await Todos.deleteMany({done: true});
</code></pre><h2>Authentication</h2><h3>register</h3><p>register new users for project. it returns a <code class="">token</code> which is used for authorization.</p><p>you need to store this token, and return this token via a function that is passed as <code class="">getToken</code> option in client options.</p><pre><code class="language-js">const {data} = await client.Auth.register({email:&#39;...&#39;, password:&#39;...&#39;})
</code></pre><h3>Login</h3><p>Authenticate user of your project. it returns a <code class="">token</code> which is used for authorization.</p><p>you need to store this token, and return this token via a function that is passed as <code class="">getToken</code> option in client options.</p><pre><code class="language-js">const {data} = await client.Auth.login({email:&#39;...&#39;, password:&#39;...&#39;})
</code></pre>`,93),d=[c],u={},g="",h=o({setup(i,{expose:e}){return e({frontmatter:{},excerpt:void 0}),(r,l)=>(t(),n("div",a,d))}});export{h as default,g as excerpt,u as frontmatter};
