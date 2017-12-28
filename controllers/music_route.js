const db = require('../database/model.js')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'music/'});
var User = mongoose.model('UserSchema', db.UserSchema);
var Music = mongoose.model('MusicSchema', db.MusicSchema);

router.post('/upload', upload.any(), function(req, res){
		
		console.log(req.files['music']);
		User.find({ session : req.body.session }, (err,user) => {
				user = user[0];
				var music_link, music_photo;
				if (req.files[0].fieldname === 'music'){
					console.log(req.files);
					music_link = req.files[0].filename;
					music_photo = req.files[1].filename;
				}else if(req.files[0].fieldname === 'photo'){
					console.log(req.files);
					music_link = req.files[1].filename;
					music_photo = req.files[0].filename;
				}

				console.log(user.user_id, req.body.title);
				Music.collection.insert({ user_id: user.user_id, title: req.body.title, link: music_link, photo: music_photo}, (err,result) => {
						res.send({'status':err});
						});
				});
		});

router.post('/find', (req,res) => {
		console.log(req.headers.search);
		Music.find( {$or:[{title: req.headers.search}, {user_id: req.headers.search}]}, (err, music) =>{
				if(!err){
				res.send(music);
				console.log(music);
				}else{
				res.send(err);	
				}
				});

		});

router.post('/myMusic', (req,res) =>{
		User.find({ session : req.headers.session }, (err,user) => {
				user = user[0];
				console.log(user);
				Music.find({user_id: user.user_id}, (err,music) => {
						if(!err){
						res.send(music.title);
						}else{
						res.send(err);
						}
						});
				});
		});

module.exports = router;
