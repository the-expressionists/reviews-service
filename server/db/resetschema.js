const Model = require('./model.js');
const path = require('path');
//const memwatch = require('@airbnb/node-memwatch');

// memory monitoring and logging to console
// memwatch.on('stats', (stats) => {
//   console.log(`used: ${stats.used_heap_size}`);
// });



// do the thing
let M = new Model();
M.connect()
.then(() => console.time('runtime'))
.then(() => M.dropSchema())
.then(() => M.createSchema())
.then(() => M.endConnection())
.then(() => console.timeEnd('runtime'));