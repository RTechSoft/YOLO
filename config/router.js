var user = require(__dirname + '/../controllers/user');

module.exports = function (router, logger) {

	router.post('/login', user.login);
	router.post('/register', user.register);
	router.put('/update', user.update);

	router.all('*', function (req, res) {
		res.send(404, {message : 'Nothing to do here.'});
	});

	router.use(function (err, req, res, next) {
		logger.log('error', err.message || err);
		return res.send(400, {message : err.message || err});
	});

	return router;
};
