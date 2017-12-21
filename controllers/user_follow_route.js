const db = require('../database/model.js')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();

var User = mongoose.model('UserSchema', db.UserSchema);
var Follow = mongoose.model('UserFollowSchema', db.UserFollowSchema);

router.post('/set', (req, res) => {
		console.log(req.headers.session);
		console.log(req.headers.follow_user_id);
		req_session = req.body.session;
		if ( req.headers.session === undefined || req.headers.follow_user_id === undefined){
		res.send({'status':false});	
		}else{
		User.find({ session: req.headers.session }, (err, user) => {
				if (user !== undefined){
				user = user[0];
				Follow.collection.insert({ user_id: user.user_id, follow: req.headers.follow_user_id }, (err, result) => {
						res.send(result);
						});}
				else {
				res.send({'status':false})
				}	

				});}
		});


router.get('/follow/:user_id', (req, res) => {
		if (req.params.user_id === undefined){
		res.send({'status':false});
		}else{
		Follow.find({ user_id: req.params.user_id }, (err, follow) => {
				res.send(follow);
				});}
		});

router.get('/follower/:user_id', (req,res) => { 
		if (req.params.user_id === undefined){
		res.send({'status':false});
		}else{
		Follow.find({ follow : req.params.user_id }, (err, follow) => {
				console.log(req.params.user_id);
				res.send(follow);
				});
		}

		});

router.post('/unfollow', (req,res) => {
		console.log(req.headers.session);
		console.log(req.headers.unfollow_user_id);
		if(req.headers.session === undefined || req.headers.unfollow_user_id === undefined){
		res.send({'status':false});
		}else{
		User.find({ session: req.headers.session }, (err, user) => {
				if (user !== undefined){
				user = user[0];
				Follow.remove({ user_id : user.user_id, follow : req.headers.unfollow_user_id }, function(err) {
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
