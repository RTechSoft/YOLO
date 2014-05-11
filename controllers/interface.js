var config = require(__dirname + '/../config/config'),
    logger = require(__dirname + '/../lib/logger'),
    util = require(__dirname + '/../helpers/util'),
    db = require(__dirname + '/../lib/mongodb');
    db = require(__dirname + '/../helpers/globe/globeapi')
    globe_app_secret = '7bacabddd57453fe55e590d9681a74b1ed25ecfd191c9b86e10a216242745ffa',
    globe_app_id = 'd5y9LtgXA76CG5cjpyiAXnCGzy7BtkMz';

exports.globe_callback = function (req, res, next) {
	var data = req.body;
	db.get().collection('users', function (err, collection) {
		if (err) return next(err);
		collection.find({_id : data.number, password : data.password}).toArray(function (err, docs) {
			if (err)
				return next(err);
			if (docs.length > 0)
				return res.send(200, {message : 'Login successful'});
			res.send(400, {message : 'Login failed'});
		});
	});
};

exports.globe_sms_notify = function (req, res, next) {
	var data = req.body;
	data._id = data.number;
	data.password = util.randomString(8);
	delete data.number;
	db.get().collection('users', function (err, collection) {
		if (err) return next(err);
		collection.insert(data, function (err) {
			if (err) return next(err);
			res.send(200, {
				username : data._id,
				password : data.password
			});
		});
	});
};


exports.globe_send = function (req, res, next) {
	var data = req.body,
		id = data.number;
	delete data.number;
	db.get().collection('users', function (err, collection) {
		if (err) return next(err);
		collection.update({_id : id}, {$set : data}, function (err) {
			if (err) return next(err);
			res.send(200, {message : 'Update successful'});
		});
	});
};
exports.semaphore_send = function (req, res, next) {
	var data = req.body,
		id = data.number;
	delete data.number;
	db.get().collection('users', function (err, collection) {
		if (err) return next(err);
		collection.update({_id : id}, {$set : data}, function (err) {
			if (err) return next(err);
			res.send(200, {message : 'Update successful'});
		});
	});
};