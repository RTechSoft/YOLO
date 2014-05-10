var path = require('path'),
	config = {
		testing : {
		},
		development : {
			env : 'development',
			port : 8000,
			logs_dir : path.normalize(__dirname + '/../logs/'),
			temp_dir : path.normalize(__dirname + '/../temp'),
			db : {
				host : 'localhost',
				port : 27017,
				name : 'YOLO'
			}
		},
		staging : {
		},
		production : {
		}
	};


// set development as default environment
!process.env['NODE_ENV'] && (process.env['NODE_ENV'] = 'development');
config = config[process.env['NODE_ENV']];

module.exports = config;
