const db = require('../database/model.js')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'music/' });
var User = mongoose.model('UserSchema', db.UserSchema);
var Music = mongoose.model('MusicSchema', db.MusicSchema);
var MusicShare = mongoose.model('MusicShareSchema', db.MusicShareSchema)
var MusicLike = mongoose.model('MusicLikeSchema', db.MusicLikeSchema);
var MusicComment = mongoose.model('MusicCommentSchema', db.MusicCommentSchema);

router.get('/:page', (req, res) => {
	var count = req.params.page-1;
	count = parseInt(count);
	if(count === -1 || count === 0){
	Music.find().sort({'timestamp':'-1'}).limit(5).find(function (err, music){
                res.send(music);
        });	
	}else{
	count = count * 5
	Music.find().sort({'timestamp':'-1'}).skip(count).limit(count).find(function (err, music){ 
		res.send(music);	
	});
	}
});

router.get('/:count/:page', (req, res) => {
        var page = req.params.page-1;
        page = parseInt(page);
        if(count === -1 || count === 0){
        Music.find().sort({'timestamp':'-1'}).limit(5).find(function (err, music){
                res.send(music);
        });
        }else{
        count = count * 5
        Music.find().sort({'timestamp':'-1'}).skip(count).limit(count).find(function (err, music){
                res.send(music);
        });
        }
});


router.post('/upload', upload.any(), function (req, res) {
	User.find({ session: req.headers.session }, (err, user) => {
		user = user[0];
		var music_link, music_photo;
		if (req.files[0].fieldname === 'music') {
			music_link = req.files[0].filename;
			music_photo = req.files[1].filename;
		} else if (req.files[0].fieldname === 'photo') {
			music_link = req.files[1].filename;
			music_photo = req.files[0].filename;
		}

		Music.find({ nickname: user.nickname, title: req.body.title }, (err, music) => {
			if (music[0]) {
				res.send({ 'status': 'already uploaded' });
			} else {
				var now = new Date();
				Music.collection.insert({ nickname: user.nickname, title: req.body.title, link: music_link, photo: music_photo, timestamp: now.getTime()}, (err, result) => {
					res.send({ 'status': err });
				});
			}
		});
	});
});

const cpUpload = upload.fields([{ name: 'music', maxCount: 1 }, { name: 'photo', maxCount: 1 }]);
router.post('/merge', cpUpload, (req, res) => {
	User.findOne({ session: req.headers.session }, (err, user) => {
		if (err) {
			res.send({ 'status': err });
			return;
		}

		var nickname = user.nickname;
		var title = req.body.title;
		var musicLink = req.files['music'][0].filename;
		var musicPhoto = req.files['photo'][0].filename;
		var copyMusicIds = req.body.copy_music_ids;

		Music.findOne({ nickname: user.nickname, title: req.body.title }, (err, music) => {
			if (music) {
				res.send({ 'status': 'already uploaded' });
				return;
			} else {
				var music = new Music();
				music.nickname = nickname;
				music.title = title;
				music.link = musicLink;
				music.photo = musicPhoto;
				music.save((err, music) => {
					if (err) {
						res.send({ 'status': err });
						return;
					}

					for (var copyMusicId of copyMusicIds) {
						var musicShare = new MusicShare();
						musicShare.music_id = music.music_id;
						musicShare.copy_music_id = copyMusicId;
						musicShare.save((err) => {
							if (err) {
								res.send({ 'status': err });
								return;
							}
						});
					}
				});
			}
		});
	});

	res.send({ 'status': 'success' });
});

router.get('/music_count/:nickname', (req, res) => {
	Music.count({ nickname: req.params.nickname }, function (err, count) {
		if (!err) {
			res.send({ 'count': count });
		}
	});
});

router.post('/find', (req, res) => {
	Music.find({ $or: [{ title: req.body.search }, { nickname: req.body.search }] }, (err, music) => {
		if (!err) {
			res.send(music);
		} else {
			res.send(err);
		}
	});

});

router.post('/detail', (req, res) => {
	Music.find({_id: req.body.music_id}, (err, music) => {
		music = music[0];
		if(music){
			MusicComment.find({ music_id: music._id }, (err, comment) => {
				res.send({'music':music, 'comment':comment});
			});	
		}else{
			res.send({'success':'doesn\'t exist music'});
		}
	});

});

router.post('/myMusic', (req, res) => {
	User.find({ session: req.headers.session }, (err, user) => {
		user = user[0];
		Music.find({ nickname: user.nickname }, (err, music) => {
			if (!err) {
				res.send(music);
			} else {
				res.send(err);
			}
		});
	});
});

router.post('/like', (req, res) => {
	User.find({ session: req.headers.session }, (err, user) => {
		user = user[0];
		if (!err) {
			MusicLike.find({ music_id: req.body.music_id, nickname: user.nickname }, (err, music_like) => {
				if (music_like[0]) {
					res.send({ 'status': 'already music like' });
				} else {
					MusicLike.collection.insert({ music_id: req.body.music_id, nickname: user.nickname }, (err, result) => {
						res.send({ 'status': err });
					});

				}
			});
		}
	});
});

router.post('/who_like', (req, res) => {
	MusicLike.find({ music_id: req.body.music_id }, (err, music) => {
		if (!err) {
			res.send(music);
		}
	});
});


router.post('/comment', (req,res) => {
        User.find({ session: req.headers.session }, (err, user) => {
                user = user[0];
		var now = new Date();
		MusicComment.collection.insert({music_id: req.body.music_id, nickname: user.nickname, comment: req.body.comment, timestamp : now.getTime()}, (err, result) => {
			if(!err){
				res.send({'status':'success'});
			}else{
				res.send({'status':err});
			}
		});
	});
});
module.exports = router;
