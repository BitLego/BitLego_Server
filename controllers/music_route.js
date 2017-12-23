const db = require('../database/model.js')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'music/' });
var User = mongoose.model('UserSchema', db.UserSchema);
var Music = mongoose.model('MusicSchema', db.MusicSchema);

router.post('/upload', upload.single('music'), function(req, res){
        if (req.file.filename === undefined || req.headers.session === undefined || req.headers.title === undefined){
                res.send({'status':false});
        }
        else{
		User.find({ session : req.headers.session }, (err,user) => {
			Music.collection.insert({ user_id: user.user_id, title: req.headers.title, link: req.file.filename}, (err,result) => {
				res.send({'status':true});
			});
		});
	}
});

module.exports = router;
