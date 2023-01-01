<p align="center">
<img width="100" src="https://raw.githubusercontent.com/asheghi/NeoBase/main/packages/dashboard/src/assets/logo-color.svg">
<h1 align="center">NeoBase</h1>
</p>

[NeoBase](https://neobase.ir) is an open source Firebase alternative. We're building the features of Firebase using enterprise-grade open source tools.

- [x] Hosted MongoDB Database.
- [x] Authentication and Authorization.
- [x] Database APIs.
  - [x] REST.
  - [ ] Realtime subscriptions.
  - [ ] GraphQL.
- [ ] Functions.
  - [ ] Database Functions.![Alt text](https://raw.githubusercontent.com/asheghi/NeoBase/main/packages/dashboard/src/assets/logo-color.svg)
  - [ ] Edge Functions
- [ ] File Storage.
- [x] Dashboard

todo add screenshot of dashboard.

## Documentation

For full documentation, visit [neobase.ir/docs](https://neobase.ir/docs)

To see how to Contribute, visit [Getting Started](./DEVELOPERS.md)

## Community & Support

- [Community Forum](https://github.com/asheghi/NeoBase/discussions). Best for: help with building, discussion about database best practices.
- [GitHub Issues](https://github.com/asheghi/NeoBase/issues). Best for: bugs and errors you encounter using NeoBase.
- [Email Support](https://neobase.ir/docs/support). Best for: problems with your database or infrastructure.
- [Discord](https://neobase.ir/discord). Best for: sharing your applications and hanging out with the community.

## Status

- [x] Alpha: We are testing NeoBase with a closed set of customers
- [x] Public Alpha: Anyone can sign up over at [neobase.ir](https://neobase.ir). But go easy on us, there are a few kinks
- [ ] Public Beta: Stable enough for most non-enterprise use-cases
- [ ] Public: Production-ready

NeoBase is under heavy development. Watch "releases" of this repo to get notified of major updates.

---

## How it works

NeoBase is a combination of open source tools. We’re building the features of Firebase using enterprise-grade, open source products. If the tools and communities exist, with an MIT, Apache 2, or equivalent open license, we will use and support that tool. If the tool doesn't exist, we build and open source it ourselves. NeoBase is not a 1-to-1 mapping of Firebase. Our aim is to give developers a Firebase-like developer experience using open source tools.

**Technology Stack**

NeoBase is a [hosted platform](https://neobase.ir). You can sign up and start using NeoBase without installing anything.
You can also [self-host](https://neobase.ir/docs/) and [develop locally](https://neobase.ir/docs/).

- [Express.js](https://expressjs.com/) Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [MongoDB](https://www.mongodb.com/docs/) MongoDB is a document database designed for ease of application development and scaling
- [Mongoose](https://mongoosejs.com/docs/api.html) Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
- [Vue.js](https://vuejs.org/) a UI library, with An approachable, performant and versatile approach for building web user interfaces

---

## Client libraries

only [javascript](https://neobase.ir/docs/client) client has been implemented sofar.
you can contribute implementing the client of your desired language, by making a wrapper for our Rest-API.

---

### Features

- [x] Management Dashboard
- [x] Basic Account Authentication
- [x] Project Management
- [x] Basic Database CRUD
- [x] Basic User Authentication
- [x] User-Based Access Control
- [x] User Management

---

### Todos

- [ ] Api Validations
- [ ] Unit/Integration Tests
- [ ] Performance Tests
- [ ] Client SDKs
- [ ] More Authentication Methods
- [ ] RealTime Database - WebSocket-based Subscription
- [ ] Push Notification
- [ ] Hosting
- [ ] Storage
- [ ] Add more documents
- [ ] Translations
