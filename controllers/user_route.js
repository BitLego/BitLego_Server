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
		console.log(req.body);
		User.find({$or : [{user_id: req.body.user_id}, {nickname: req.body.nickname}]}, (err, user) => {
				if(user[0]){
					res.send({'status':'aleady joined'});
				}else{
				User.collection.insert({user_id: req.body.user_id, password: crypto.createHash('sha512').update(req.body.password).digest('base64'), name: req.body.name, email : req.body.email, nickname: req.body.nickname }, (err, user) => {
						if(!err){
						res.send({'status':'success'});
						}else{	
						res.send({'status':err});
						}
						});
				}
				});
		});

router.post('/login', (req, res) => {
		User.find({ user_id: req.body.user_id, password: crypto.createHash('sha512').update(req.body.password).digest('base64') }, (err, user) => {
				user = user[0];
				if(err){
					res.send(err);
				}else{
				var sha = crypto.createHash('sha256');
				sha.update(Math.random().toString());
				hash = String(sha.digest('hex'));
				session_id = user._id + hash;

				sha = crypto.createHash('sha256');
				sha.update(session_id);
				session_id = String(sha.digest('hex'));

				User.update({_id:user._id},{$set: {session:session_id}},function(err, result) {
					if(!err){
						res.send( {'session' : session_id} );
					}else{
						res.send({'status':err});
					}
				});
				}
				});
});


router.post('/information', (req, res) => {
		user_session = req.headers.session;
		if (user_session === undefined){
		res.send({'status':false});
		}else{
		User.find({ session: user_session }, (err, user) => {
				user = user[0];
				res.send({'user_id': user.user_id, 'name': user.name, 'email': user.email, 'nickname': user.nickname, 'profile': user.profile});
				}); 
		}
});

router.post('/profile', upload.single('profile'), function(req, res){
	User.update({session: req.headers.session}, {$set: {profile : req.file.filename}}, function(err, result) {
		res.send({'status':err});
	});
});

module.exports = router;
