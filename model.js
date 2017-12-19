var mongoose = require('mongoose');

var UserSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: String,
	password: String,
	name: String,
	email: String,
	nickname: String,
	join_date: {type:Date, default: Date.now}
});

var UserFollowSchema = new Schema({
	user_id: String,
	follow_user_id: String
});

var UserFollowerSchema = new Schema({
	user_id: String,
	follower_user_id: String

});

var MusicSchema = new Schema({
	music_id: Schema.Types.ObjectId,
	user_id: String,
	original_link: String,
	title: String,
	link: String,

});

var MusicSharedSchema = new Schema({
	music_id: String,
	copy_music_link: String,
	
});

var MusicLikeSchema = new Schema({
	music_id: String,
	nickname: String,

});
