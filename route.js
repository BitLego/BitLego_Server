const express = require('express');
const router = express.Router();
const db = require('/home/legobit/model.js')
const mongoose = require('mongoose')

var User = mongoose.model('UserSchema', db.UserSchema)

router.get('/', (req, res) => {
	res.end('test');
});

router.post('/register', (req, res) => {
  User.find({ user_id: req.params('user_id') }, (err, user) => {
    if (user != ''){
	 res.send('register : already have account');
	}
    else {
	User.collection.insert({ user_id: req.params('user_id'), password: req.params('password'), name: req.params('name'), nickname: req.params('nicknames') }, (err, user) => {
    res.send('register : success');
  });
 	}
  });
});

router.get('/:name', (req, res) => {
  User.find({ user_id: req.params.name }, (err, user) => {
    res.send( user );
  });
});

module.exports = router;
