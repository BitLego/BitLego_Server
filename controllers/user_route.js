const express = require('express');
const expressSession = require('express-session');
const router = express.Router();
const db = require('../database/model.js')
const mongoose = require('mongoose')
const crypto = require('crypto');
const multer = require('multer');

var upload = multer({ dest: 'profile/' });
var User = mongoose.model('UserSchema', db.UserSchema)

router.get('/', (req, res) => {
		res.end('test');
		});

router.post('/register', (req, res) => {
		var response;
		console.log(req.body.user_id , req.body.password , req.body.name , req.body.email , req.body.nickname);
		if (req.body.user_id === undefined || req.body.password === undefined || req.body.name === undefined || req.body.email === undefined || req.body.nickname === undefined){
		response = false;
		res.send({'status':response});
		}
		else{
		User.find({ user_id: req.body.user_id }, (err, user) => {
				if (user !== undefined){
				response = false;
				res.send({'status':response});
				}
				else {
				User.collection.insert({user_id: req.body.user_id, password: crypto.createHash('sha512').update(req.body.password).digest('base64'), name: req.body.name, email : req.body.email, nickname: req.body.nickname }, (err, user) => {
						response = true;
						res.send({'status':response});
						});
				}
				});}
		});

router.post('/login', (req, res) => {
		if (req.headers.user_id !== undefined || req.headers.password !== undefined){
		console.log(req.headers.user_id); 
		User.find({ user_id: req.headers.user_id, password: crypto.createHash('sha512').update(req.headers.password).digest('base64') }, (err, user) => {
				user = user[0];

				var sha = crypto.createHash('sha256');
				sha.update(Math.random().toString());
				hash = String(sha.digest('hex'));
				session_id = user._id + hash;

				sha = crypto.createHash('sha256');
				sha.update(session_id);
				session_id = String(sha.digest('hex'));

				User.update({_id:user._id},{$set: {session:session_id}},function(err, result) {
						console.log(result);
						});
				res.send( {'session' : session_id} );
				});
		}else{
		res.send({'status':false});
		}
});

router.get('/:id', (req,res) => {
		User.find({user_id: req.params.id}, (err, user) => {
				res.send(user);
				});
		});

router.post('/information', (req, res) => {
		user_session = req.body.session;
		if (user_session === undefined){
		res.send({'status':false});
		}else{
		console.log(user_session);
		User.find({ session: user_session }, (err, user) => {
			//	console.log(user);
				user = user[0];
			//	console.log(user);
				res.send({'user_id': user.user_id, 'name': user.name, 'email': user.email, 'nickname': user.nickname, 'profile': user.profile});
				}); 
		}
});

router.post('/profile', upload.single('profile'), function(req, res){
	if (req.file.filename === undefined || req.body.session === undefined){
                res.send({'status':false});
	}
	else{
	User.update({session: req.body.session}, {$set: {profile : req.file.filename}}, function(err, result) {
		res.send({'status':true});
	});}
});

module.exports = router;
