const db = require('../database/model.js')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();

var User = mongoose.model('UserSchema', db.UserSchema);
var Follow = mongoose.model('UserFollowSchema', db.UserFollowSchema);

router.post('/set', (req, res) => {
		req_session = req.body.session;
		if ( req_session == '' || req.body.follow_user_id == ''){
		res.send({'status':false});	
		}else{
		User.find({ session: req_session }, (err, user) => {
				if (user != ''){
				user = user[0];
				Follow.collection.insert({ user_id: user.user_id, follow: req.body.follow_user_id }, (err, result) => {
						res.send({'status':true});
						});}
				else {
				res.send({'status':false})
				}	

				});}
		});


router.get('/follow/:user_id', (req, res) => {
		if (req.params.user_id == ''){
		res.send({'status':false});
		}else{
		Follow.find({ user_id: req.params.user_id }, (err, follow) => {
				res.send(follow);
				});}
		});

router.get('/follower/:user_id', (req,res) => { 
		if (req.params.user_id == ''){
		res.send({'status':false});
		}else{
		Follow.find({ follow_user_id: req.params.user_id }, (err, follow) => {
				res.send(follow);
				});
		}

		});

module.exports = router;
