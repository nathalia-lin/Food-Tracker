// SETUP
// *********************************************************

// REQUIRE
require('./db');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

// MONGOOSE MODEL
const User = mongoose.model('User');
const Food = mongoose.model('Food');
const Day = mongoose.model('Day');

const sessionOptions = {
	secret: 'secret!',
	resave: true,
	saveUninitialized: true
};

// SET HBS -> CHANGE TO BOOTSTRAP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
mongoose.set('useCreateIndex', true);

// MIDDLEWARE
app.use(session(sessionOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

//Log HTTP Requests
app.use(morgan('tiny'));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
	secret: 'secret!',
	resave: false,
	saveUninitialized: true
}));

app.use(function (req, res, next) {
	if (req.session.passport) {
		res.locals.user = req.session.passport.user;
	} 
	next();
});

// PAGES
// *********************************************************

// HOME
app.get('/', function (req, res) {
	if (res.locals.user){
		User.findOne({username: res.locals.user}, (err, user) => {
			if (err) {
				console.log(err);
			} else {
				Day.findOne({user: user})
				.populate('details')
				.exec (function (err, today){
					if (err){
						console.log(err);
					} else {
						console.log(today);
						if (today == null){
							res.render('index', {user: user, budget: user.budget, calorie: user.calorie});
						} else {
							let food_prices = [];
							let food_calories = [];
							const budArr = today.details.map(food => food_prices.push(food.price));
							const calArr = today.details.map(food => food_calories.push(food.calories));
							const spent = food_prices.reduce((accumulator, current) => {
								return accumulator + current;
							}, 0);
							const consumed = food_calories.reduce((accumulator, current) => {
								return accumulator + current;
							}, 0);
							const budget = user.budget - spent;
							const calorie = user.calorie - consumed;
							res.render('index', { user: user, budget: budget, calorie: calorie });
						}
					};
				});
			};
		});
	} else {
		res.render('index', {message: "JOIN AND TRACK YOUR FOOD!"});
	}
});

// REGISTER
app.get('/register', function (req, res) {
	res.render('register');
});

app.post('/register', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var calorie = req.body.calories;
	var budget = req.body.budget;

	if (password.length < 8 && username.length < 8) {
		res.render('register', { message: "USERNAME PASSWORD TOO SHORT" });
	} else if (calorie < 1200) {
		res.render('register', { message: "DAILY CALORIE INTAKE TOO LOW" });
	} else if (budget < 0) {
		res.render('register', { message: "BUDGET CANNOT BE NEGATIVE" });
	} else {
		var user = new User({
			username: username,
			calorie: calorie,
			budget: budget 
		});
		User.register(user, password, function (err) {
			if (err) {
				if (err.name === 'UserExistsError') {
					res.render('register', { message: 'A USER WITH THE GIVEN USERNAME IS ALREADY REGISTERED' });
				} else {
					res.render('register', { message: 'ERROR WHILE USER REGISTER' });
				}
			} else {
				passport.authenticate('local', { successRedirect: '/', failureRedirect: '/register' })(req, res);
			}
		});
	}
});

// LOGIN
app.get('/login', function (req, res, next) {
	res.render('login');
});

app.post('/login', function (req, res) {
	passport.authenticate('local', function (err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			res.render('login', { message: "INVALID USERNAME OR PASSWORD" });
		}
		req.login(user, function (err) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/');
			}
		});
	})(req, res);
});

// DETAILS
app.get('/details', function (req, res) {
	if (res.locals.user) {
		User.findOne({username: res.locals.user}, (err, user) => {
			if (err) {
				console.log(err);
			} else {
				Day.find({ user: user })
					.populate('details')
					.exec (function (err, day){
					if (err){
						console.log(err);
					} else {
						res.render('details',{day: day});
					}
				});
			}
		})
	} else {
		res.redirect('/login');
	}
});

// ADD FOOD
app.get('/add', function (req, res) {
	if (res.locals.user) {
		res.render('add', {user: res.locals.user});
	} else {
		res.redirect('/login');
	}
});

app.post('/add', function (req, res) {
	if (res.locals.user) {
		const food = new Food({
			food: req.body.food,
			price: req.body.price,
			calories: req.body.calories,
			date: req.body.date,
		});
		food.save((err) => {
			if (err){
				console.log(err);
			}
		})
		User.findOne({username: res.locals.user}, (err, user) => {
			if (err) {
				console.log(err);
			} else {
				Day.findOne({user: user, date: req.body.date}, function (err, day) {
					if (err) {
						console.log(err);
					} else {
						if (day === null) {
				
							const days = new Day ({
								user: user,
								details: [food._id],
								date: req.body.date
							})

							days.save(function (err) {
								if (err) {
									console.log(err);
								} else {
									res.redirect('/');
								}
							});
						
						} else {
							day.details.push(food._id);
							day.save(function (err) {
								if (err) {
									console.log(err);
								} else {
									res.redirect('/');
								}
							});
						}
					};
				});
			}
		})
	} else {
		res.redirect('/login');
	}
});

// DELETE FOOD
app.get("/delete/:slug", (req, res, next)=> {
	Food.findOneAndDelete({ _id: req.params.slug }, (err, food) => {
		if (err){
			console.log(err);
		} else {
			res.redirect('/details');
		};
	});
});

// MODIFY FOOD
app.get("/modify/:slug", (req, res, next) => {
	Food.findOne({ _id: req.params.slug })
	.populate()
	.exec (function (err, food){
		if (err){
			console.log(err);
		} else {
			res.render('modify', { food: food });
		}
	});
});

app.post("/modify/:slug", (req, res, next) => {
	const food = {
		food: req.body.food,
		price: parseInt(req.body.price),
		calories: parseInt(req.body.calories),
	};		
	Food.findOneAndUpdate({ _id: req.params.slug}, food, (err, food) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/details');
		};
	});
})

// LOGOUT
app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});


let PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
	console.log("Currently listening on " + PORT);
});