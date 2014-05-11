var user = require(__dirname + '/../controllers/user');
var sms_interface = require(__dirname + '/../controllers/interface');

module.exports = function (router, logger) {

	router.post('/login', user.login);
	router.post('/register', user.register);
	router.put('/update', user.update);

	router.post('/globe', sms_interface.globe_callback);
	router.get('/globe', sms_interface.globe_callback);
	router.get('/globe/sms_notify', sms_interface.globe_sms_notify);

	router.all('*', function (req, res) {
		res.send(404, {message : 'Nothing to do here.'});
	});

	router.use(function (err, req, res, next) {
		logger.log('error', err.message || err);
		return res.send(400, {message : err.message || err});
	});

	return router;
};
