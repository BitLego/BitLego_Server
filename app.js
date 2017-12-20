const express = require('express');
const path = require('path');
const app = express();
const db = require('/home/legobit/database/db.js'); 
const userRoute = require('/home/legobit/user_route.js');
const userFollowRoute = require('/home/legobit/user_follow_route.js');
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

app.use('/user', userRoute);
app.use('/follow', userFollowRoute);

app.listen(9949, () => {
  console.log('Express App on port 9949!');
});
