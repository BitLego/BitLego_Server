const db = require('../database/model.js')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'music/'});
var User = mongoose.model('UserSchema', db.UserSchema);
var Music = mongoose.model('MusicSchema', db.MusicSchema);
var MusicLike = mongoose.model('MusicLikeSchema', db.MusicLikeSchema);

router.post('/upload', upload.any(), function(req, res){	
		User.find({ session : req.body.session }, (err,user) => {
				user = user[0];
				var music_link, music_photo;
				if (req.files[0].fieldname === 'music'){
					music_link = req.files[0].filename;
					music_photo = req.files[1].filename;
				}else if(req.files[0].fieldname === 'photo'){
					music_link = req.files[1].filename;
					music_photo = req.files[0].filename;
				}

				console.log(user.user_id, req.body.title);
				Music.collection.insert({ nickname: user.nickname, title: req.body.title, link: music_link, photo: music_photo}, (err,result) => {
						res.send({'status':err});
						});
				});
		});

router.post('/find', (req,res) => {
		console.log(req.headers.search);
		Music.find( {$or:[{title: req.headers.search}, {nickname: req.headers.search}]}, (err, music) =>{
				if(!err){
				res.send(music);
				}else{
				res.send(err);	
				}
				});

		});

router.post('/myMusic', (req,res) =>{
		User.find({ session : req.headers.session }, (err,user) => {
				user = user[0];
				Music.find({nickname: user.nickname}, (err,music) => {
						if(!err){
						res.send(music);
						}else{
						res.send(err);
						}
						});
				});
		});

router.post('/like', (req,res) =>{
		console.log(req.headers);
		User.find({ session: req.headers.session }, (err,user) => {
			user = user[0];
			if(!err){
				MusicLike.collection.insert({music_id: req.headers.music_id, nickname: user.nickname}, (err,result) => {
				res.send({'status':result});
				});
			}	
		});				
});

router.post('/who_like', (req,res) => {
		MusicLike.find({music_id: req.headers.music_id}, (err,music) => {
			if(!err){
				res.send(music);
			}
		});
});
module.exports = router;
