var crypto = require('crypto'),
    fs = require('fs');

exports.get_data = function (reqd, optional, body) {
    var i = reqd.length,
        ret = {},
        temp;
    while (i--) {
        if (!body[temp = reqd[i]] || body[temp] instanceof Array)
            return temp + ' is missing';
        ret[temp] = body[temp];
    }
	i = optional.length;
    while (i--) {
        if (body[temp = optional[i]])
			ret[temp] = body[temp];
    }
    return ret;
};

exports.toDay = function (str) {
    return   str.replace("Mon", "M")
                .replace(/Tue(s?)/g, "T")
                .replace("Wed", "W")
                .replace(/Thurs|Th/g, "H")
                .replace("Fri", "F")
                .replace("Sat", "S");
};

exports.hash = function (string, hash) {
    return crypto.createHash(hash || 'sha1').update('' + string).digest('hex');
};

exports.randomString = function (i) {
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
		str = '',
		l = i || 32;

    while (l--)
        str += possible.charAt(~~(Math.random() * 62));

    return str;
};

exports.pad = function (num, size) {
    return ('000000000' + num).substr(-(size || 2));
};

exports.extractFiles = function (files, name, next) {
    if (files[name])
        return (files[name] instanceof Array) ? files[name] : [files[name]];
    if (next) {
        next(name + ' is missing');
		return false;
	}
    return [];
};

exports.mkdir = function (dir, cb) {
    fs.exists(dir, function (exists) {
        if (exists) cb();
        else {
            fs.mkdir(dir, 666, function (err) {
                cb(err);
            });
        }
    });
}

/**
	if file exists, give a new version
*/
exports.getSafeFileName = function (path, cb) {
    var original_path = path,
        version = 1,
        check = function (path) {
            fs.exists(path, function (exists) {
                if (exists) {
                    check(original_path + '-' + (++version), version);
                }
                else {
                    cb(path, version);
                }
            });
        };
    check(original_path);
};

exports.cleanFileName = function (file_name) {
    return  file_name
            .replace(/\.\./gi, '')              // remove consecutive 2 dots
            .replace(/^\./i, '')                // remove dot on if first character
            .replace(/\s+/gi, '-')              // replace space(s) with dash
            .replace(/[^a-zA-Z0-9\.-_]/gi, '');	// strip any special characters
};

exports.runTest = function () {
    var Mocha = require('mocha'),
		path = require('path'),
		mocha = new Mocha({reporter : 'spec'});

    fs.readdirSync(__dirname + '/../tests/').filter(function (file) {
        return file.substr(-3) === '.js';
    }).forEach(function (file) {
        mocha.addFile(
            path.join(__dirname + '/../tests/', file)
        );
    });

	mocha.run(function (failures) {
		process.on('exit', function () {
			process.exit(failures);
		});
	});
};

exports.toTitleCase = function (str) {
	if (str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
	return false;
};

exports.currentDate = function () {
	var d = new Date();
	return [d.getFullYear(), this.pad(d.getMonth() + 1), this.pad(d.getDate())].join('-');
};
