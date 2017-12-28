const db = require('../database/model.js')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();

var User = mongoose.model('UserSchema', db.UserSchema);
var Follow = mongoose.model('UserFollowSchema', db.UserFollowSchema);

router.post('/set', (req, res) => {
		console.log(req.headers.session);
		console.log(req.headers.follow_user_nickname);
		req_session = req.body.session;
		if ( req.headers.session === undefined || req.headers.follow_user_nickname === undefined){
		res.send({'status':false});	
		}else{
		User.find({ session: req.headers.session }, (err, user) => {
				if (user !== undefined){
				user = user[0];
				Follow.collection.insert({ nickname: user.nickname, follow_user_nickname: req.headers.follow_user_nickname }, (err, result) => {
						res.send(result);
						});}
				else {
				res.send({'status':false})
				}	

				});}
		});


router.get('/follow/:nickname', (req, res) => {
		if (req.params.user_id === undefined){
		res.send({'status':false});
		}else{
		Follow.find({ nickname: req.params.nickname }, (err, follow) => {
				res.send(follow);
				});}
		});

router.get('/follower/:nickname', (req,res) => { 
		if (req.params.nickname === undefined){
		res.send({'status':false});
		}else{
		Follow.find({ follow_user_nickname : req.params.nickname }, (err, follow) => {
				res.send(follow);
				});
		}

		});

router.post('/unfollow', (req,res) => {
		if(req.headers.session === undefined || req.headers.unfollow_user_nickname === undefined){
		res.send({'status':false});
		}else{
		User.find({ session: req.headers.session }, (err, user) => {
				if (user !== undefined){
				user = user[0];
				Follow.remove({ nickname : user.nickname, follow_user_nickname : req.headers.unfollow_user_nickname }, function(err) {
						if (!err) {
						res.send({'status':true});
						}
						else {
						res.send({'status':false});
						}
						});
				}
				});
		}

		});

module.exports = router;
