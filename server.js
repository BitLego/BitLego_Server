const express = require('express');
const path = require('path');
const app = express();
const db = require('./db.js'); 
const route = require('./route.js');

db();
app.use('/', route)
app.listen(9949, () => {
  console.log('Express App on port 9949!');
});
