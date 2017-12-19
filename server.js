const express = require('express');
const path = require('path');
const app = express();
const db = require('./db.js'); 
const route = require('./route.js');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
app.use(bodyParser());
db();
app.use( expressSession ( {
	secret : 'L3g0Bit',
	saveUninitialized: true,
	resave: false,
	cookie: {expire: new Date(Date.now+60*60), singed: true} 
}));
app.use('/', route)

app.listen(9949, () => {
  console.log('Express App on port 9949!');
});
