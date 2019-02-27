var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
	username: {type: String},
	budget: { type: Number, required: true },
	calorie: { type: Number, required: true }
});

User.plugin(passportLocalMongoose);
mongoose.model('User', User);

var Food = new mongoose.Schema({
	food: { type: String },
	price: { type: Number },
	calories: { type: Number },
	date: { type: String },
});

Food.plugin(URLSlugs('_id'));
mongoose.model('Food', Food);

var Day = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
	date: { type: String}
}, {
	_id: true
});

// Day.plugin(URLSlugs('_id'));
mongoose.model('Day', Day);

// // is the environment variable, NODE_ENV, set to PRODUCTION? 
// var dbconf = void 0;
// if (process.env.NODE_ENV === 'PRODUCTION') {
// 	// if we're in PRODUCTION mode, then read the configration from a file
// 	// use blocking file io to do this...
// 	var fs = require('fs');
// 	var path = require('path');
// 	var fn = path.join(__dirname, 'config.json');
// 	var data = fs.readFileSync(fn);

// 	// our configuration file will be in json, so parse it and set the
// 	// conenction string appropriately!
// 	var conf = JSON.parse(data);
// 	dbconf = conf.dbconf;
// } else {
// 	// if we're not in PRODUCTION mode, then use
// 	dbconf = 'mongodb://localhost/happyeats';
// 	// dbconf = 'mongodb://nl1532:ysN2DwsR@class-mongodb.cims.nyu.edu/nl1532';
// }
var dbconf = 'mongodb://happyeats:happy123@ds123664.mlab.com:23664/happyeats';

mongoose.connect(dbconf, { useNewUrlParser: true });
