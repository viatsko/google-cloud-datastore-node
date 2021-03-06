# google-cloud-datastore-node

NodeJS library to simplify working with Google Cloud DataStore

Based on a code by Google https://github.com/GoogleCloudPlatform/nodejs-getting-started

The difference is that this library uses Promises instead of callbacks which leads to a better code organization
and can be used as well with async/await.

## Installation

`yarn add google-cloud-datastore-node`

## Usage

### Setting up project id

```js
const { setup, createDao } = require('google-cloud-datastore-node');

setup({
    projectId: 'my-awesome-project'
});
```

### Creating an entity

```js
const { setup, createDao } = require('google-cloud-datastore-node');

const testDao = createDao('Test');

testDao.create({
    firstname: 'John',
    lastname: 'Tester'
}).then(() => {
    console.log('Entry has been created!');
}).catch(err => console.error(err));
```

### Reading an entity

```js
const { setup, createDao } = require('google-cloud-datastore-node');

const testDao = createDao('Test');

testDao.read('<ID>').then((data) => {
    console.log(data);
}).catch(err => console.error(err));
```

### Updating an entity

```js
const { setup, createDao } = require('google-cloud-datastore-node');

const testDao = createDao('Test');

testDao.update('<ID>', {
    firstname: 'John',
    lastname: 'Tester'
}).then(() => {
    console.log('Entry has been updated!');
}).catch(err => console.error(err));
```

### Deleting an entity

```js
const { setup, createDao } = require('google-cloud-datastore-node');

const testDao = createDao('Test');

testDao.delete('<ID>').then(() => {
    console.log('Entry has been deleted!');
});
```

### Listing entities

```js
const { setup, createDao } = require('google-cloud-datastore-node');

const testDao = createDao('Test');

/* parameters are `limit`, `order`, `token` */
testDao.list(10, 'test').then(({ data, hasMore }) => {
    /* `hasMore` can be re-used as a `token` param in case of pagination implementation */
    console.log(data);
});
```

### Listing entities with filters applied

```js
const { setup, createDao } = require('google-cloud-datastore-node');

const testDao = createDao('Test');

/* parameters are `filters`, `limit`, `order`, `token` */
testDao.listBy([
    ['location', 'CA']
], 10, 'test').then(({ data, hasMore }) => {
    /* `hasMore` can be re-used as a `token` param in case of pagination implementation */
    console.log(data);
});
```

## Additional information

* [Deploying Google Cloud Functions in 5 easy steps](https://medium.com/@viatsko/deploying-google-cloud-functions-in-5-easy-steps-21f6d837c6bb)
* [Google Cloud Functions: Scheduling (Cron)](https://medium.com/@viatsko/google-cloud-functions-scheduling-cron-5657c2ae5212)

## License

[MIT](./LICENSE)
