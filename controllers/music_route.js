const db = require('../database/model.js')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'music/'});
var User = mongoose.model('UserSchema', db.UserSchema);
var Music = mongoose.model('MusicSchema', db.MusicSchema);

router.post('/upload', upload.single('music'), function(req, res){
		User.find({ session : req.body.session }, (err,user) => {
			user = user[0];
			console.log(user.user_id, req.body.title);
			Music.collection.insert({ user_id: user.user_id, title: req.body.title, link: req.file.filename}, (err,result) => {
				res.send({'status':err});
			});
		});
});

router.post('/find', (req,res) => {
	console.log(req.headers.search);
	Music.find( {$or:[{title: req.headers.search}, {user_id: req.headers.search}]}, (err, music) =>{
		if(!err){
			res.send(music);
		}else{
			res.send(err);	
		}
	});

});

module.exports = router;
