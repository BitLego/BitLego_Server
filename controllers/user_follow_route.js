const db = require('../database/model.js')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();

var User = mongoose.model('UserSchema', db.UserSchema);
var Follow = mongoose.model('UserFollowSchema', db.UserFollowSchema);

router.post('/set', (req, res) => {
		User.find({ session: req.headers.session }, (err, user) => {
				if(err){
					res.send({'status':err});
				}else{
				user = user[0];
				Follow.find({nickname: user.nickname, follow_user_nickname: req.body.follow_user_nickname}, (err, follow) => {
					if(follow[0]){
					res.send({'status':'already follow'});
					}else{
					Follow.collection.insert({ nickname: user.nickname, follow_user_nickname: req.body.follow_user_nickname }, (err, result) => {
						if(!err){
						res.send(result);
						}
						});}	
				});}
		});
});


router.get('/follow/:nickname', (req, res) => {
		Follow.find({ nickname: req.params.nickname }, (err, follow) => {
				if(!err){
				res.send(follow);
				}
				});
		});

router.get('/follow_count/:nickname', (req,res) => {
		Follow.count({nickname: req.params.nickname}, function(err,count){
		if(!err){
			res.send({'count':count});
		}		
	});
});

router.get('/follower/:nickname', (req,res) => { 
		Follow.find({ follow_user_nickname : req.params.nickname }, (err, follow) => {
				if(!err){
				res.send(follow);
				}
				});
		});
router.get('/follower_count/:nickname', (req,res) => {
                Follow.count({ follow_user_nickname: req.params.nickname}, function(err,count){
                if(!err){
                        res.send({'count':count});
                }
        });
});

router.post('/unfollow', (req,res) => {
		User.find({ session: req.headers.session }, (err, user) => {
				if(err){
					res.send({'status':err});
				}else{
				user = user[0];
				Follow.remove({ nickname : user.nickname, follow_user_nickname : req.body.unfollow_user_nickname }, function(err) {
						if (!err) {
						res.send({'status':err});
						}
						else {
						res.send({'status':err});
						}
						});
				}
				});
		

		});

module.exports = router;
