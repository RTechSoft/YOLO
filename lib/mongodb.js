var mongoClient = require('mongodb').MongoClient,
	config = require(__dirname + '/../config/config').db,
	db;

mongoClient.connect([
		'mongodb://',
		config.host,
		':',
		config.port,
		'/',
		config.name
	].join(''), {
		server : {
			auto_reconnect: true
		}
	}, function (err, d) {
		if (err) throw err;
		db = d;
		console.log('connected to', config.name, 'database');
	}
);

module.exports.get = function () {
	return db;
};
