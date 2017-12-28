var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.UserSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	password: String,
	name: String,
	email: String,
	nickname: String,
	profile: String,
	session: String
});

exports.UserFollowSchema = new Schema({
	nickname: String,
	follow_user_nickname: String
});


exports.MusicSchema = new Schema({
	music_id: Schema.Types.ObjectId,
	nickname: String,
	title: String,
	link: String,
	like: Number,
	photo: String,

});

exports.MusicSharedSchema = new Schema({
	music_id: String,
	original_music_link: String,
	copy_music_link: String,
		
});

exports.MusicLikeSchema = new Schema({
	music_id: String,
	nickname: String,

});
