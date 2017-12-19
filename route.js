const express = require('express');
const expressSession = require('express-session');
const router = express.Router();
const db = require('/home/legobit/model.js')
const mongoose = require('mongoose')
const crypto = require('crypto');


var User = mongoose.model('UserSchema', db.UserSchema)

router.get('/', (req, res) => {
		res.end('test');
		});

router.post('/register', (req, res) => {
		console.log(req);
		User.find({ user_id: req.body.user_id }, (err, user) => {
				if (user != ''){
				res.send('register : already have account');
				}
				else {
				User.collection.insert({ user_id: req.body.user_id, password: crypto.createHash('sha512').update(req.body.password).digest('base64'), name: req.body.name, email : req.body.email, nickname: req.body.nickname }, (err, user) => {
						res.send('register : success');
						});
				}
				});
		});

router.post('/login', (req, res) => { 
		User.find({ user_id: req.body.user_id, password: crypto.createHash('sha512').update(req.body.password).digest('base64') }, (err, user) => {
				user = user[0];
				req.session.id = user._id;
				var sess = req.session.id;
				User.update({_id:user._id},{$set: {session:sess}},function(err, result) {

						});
				res.send( 'session : '+sess );
				});
		});

router.get('/:id', (req,res) => {
		User.find({user_id: req.params.id}, (err, user) => {
				res.send(user);
				});
		});

module.exports = router;
