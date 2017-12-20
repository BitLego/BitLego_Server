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

				var sha = crypto.createHash('sha256');
    				sha.update(Math.random().toString());
				hash = String(sha.digest('hex'));
				session_id = user._id + hash;

				sha = crypto.createHash('sha256');
				sha.update(session_id);
				session_id = String(sha.digest('base64'));

				User.update({_id:user._id},{$set: {session:session_id}},function(err, result) {
					console.log(result);
						});
				res.send( 'session : '+session_id );
				});
		});

router.get('/:id', (req,res) => {
		User.find({user_id: req.params.id}, (err, user) => {
				res.send(user);
				});
		});

module.exports = router;
