var request = require('request');
var crypto = require('crypto');
var Q = require('q');
var through = require('through');
var underscore = require('underscore');

module.exports = BitstampRequest = function(client_id, api_key, api_secret){
	this.client_id = client_id;
	this.api_key = api_key;
	this.api_secret = api_secret;

	return this;
}

function credentials(bitstampRequest){
	var deferred = Q.defer();

	var clientId = bitstampRequest.client_id;
	var key = bitstampRequest.api_key;
	var nonce = Date.now().toString();

	var message = nonce + clientId + key;

	var hmac = crypto.createHmac('sha256', bitstampRequest.api_secret);
	hmac.setEncoding('hex');
	var uppercase = through(function(data){
		this.queue(data.toUpperCase());
	});
	uppercase.on('data', function(data){
		var ret = {
			key: key,
			signature: data,
			nonce: nonce
		};
		deferred.resolve(ret);
	});

	hmac.pipe(uppercase);
	hmac.end(message);

	return deferred.promise;
}

BitstampRequest.prototype.get = request.get;

BitstampRequest.prototype.post = function(uri, options, callback){
	var ops = options, cb = callback;
	if (!callback){
		ops = {};
		cb = options;
	}

	credentials(this).then(function(creds){
		underscore.extend(ops, creds);
		request.post(uri, {form: ops}, cb);
	})
}
