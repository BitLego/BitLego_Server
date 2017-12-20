var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.UserSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	password: String,
	name: String,
	email: String,
	nickname: String,
	session: String
});

exports.UserFollowSchema = new Schema({
	user_id: String,
	follow_user_id: String
});

exports.UserFollowerSchema = new Schema({
	user_id: String,
	follower_user_id: String

});

exports.MusicSchema = new Schema({
	music_id: Schema.Types.ObjectId,
	user_id: String,
	original_link: String,
	title: String,
	link: String,

});

exports.MusicSharedSchema = new Schema({
	music_id: String,
	copy_music_link: String,
	
});

exports.MusicLikeSchema = new Schema({
	music_id: String,
	nickname: String,

});
