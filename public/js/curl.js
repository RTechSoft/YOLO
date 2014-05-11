/**
	cXHR.js

	@author	Raven Lagrimas | any.TV
*/

(function (root) {

	var Request = function (method) {
			this.started = false;
			this.method = method;
			this.before = function (fn) {
				this.before = fn;
				return this;
			};
			this.after = function (fn) {
				this.after = fn;
				return this;
			};
			this.to = function (url) {
				this.url = url;
				return this;
			};
			this.then = function (cb) {
				if (!this.scb)
					this.scb = cb;
				else if (!this.ecb)
					this.ecb = cb;
				else
					this.fcb = cb;
				!this.started && this.send();
				return this;
			};
			this.onerror = function (cb) {
				this.ecb = cb;
				!this.started && this.send();
				return this;
			};
			this.finally = function (cb) {
				this.fcb = cb;
				!this.started && this.send();
				return this;
			};
			this.send = function (data) {
				var req = new XMLHttpRequest(),
					self = this,
					payload = '',
					stringify = function (obj) {
						var ret = [],
							key;
						for (key in obj)
							ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
						return ret.join('&');
					};

				this.started = true;
				this.before();

				if (this.method === 'GET' && data)
					this.url += '?' + stringify(data);
				else {
					data = data || {};
					payload = stringify(data);
				}

				req.open(this.method, this.url, true);
				req.withCredentials = true;
				req.setRequestHeader('Accept', 'application/json');

				if (this.method !== 'GET')
					req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

				req.onreadystatechange = function () {
					if (req.readyState === 4) {
						self.after();
						if (req.status === 200)
							self.scb && self.scb(JSON.parse(req.responseText));
						else
							self.ecb && self.ecb(JSON.parse(req.responseText));
						self.fcb && self.fcb();
					}
				};

				req.onerror = function (err) {
					self.after();
					self.ecb && self.ecb(err);
					self.fcb && self.fcb();
				};

				req.send(payload);
				return this;
			};
		};

	root.cXHR = {
		to :  function (url) {
			return new Request('GET').before(this.beforeRequest).to(url).after(this.afterRequest);
		},
		get :  function (url) {
			return new Request('GET').before(this.beforeRequest).to(url).after(this.afterRequest);
		},
		post : function (url) {
			return new Request('POST').before(this.beforeRequest).to(url).after(this.afterRequest);
		},
		put : function (url) {
			return new Request('PUT').before(this.beforeRequest).to(url).after(this.afterRequest);
		},
		delete : function (url) {
			return new Request('DELETE').before(this.beforeRequest).to(url).after(this.afterRequest);
		},
		setBeforeRequest : function (fn) {
			this.beforeRequest = fn;
			return this;
		},
		setAfterRequest : function (fn) {
			this.afterRequest = fn;
			return this;
		},
		beforeRequest : function () {},
		afterRequest : function () {}
	};

} (this) );
