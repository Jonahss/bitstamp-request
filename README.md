# bitstamp-request #

Send requests to the Bitstamp API in much the same way you use Mikeal's 'request' module.
The key, signature, and nonce parameters are automatically added to every http POST request.

## Install ##
```
npm install bitstamp-request
```

## Usage ##

Initialize with the values associated with your account
```
var Bitstamp = require('bitstamp-request');
var b = new Bitstamp(bitstamp_customer_id, bitstamp_api_key, bitstamp_api_secret);
```
Now just make http POST requests
```
b.post('https://www.bitstamp.net/api/buy/', {amount: 100, price:201.50}, function(err, response){
	console.log(response.body);
})
```
Public api requests also supported
```
b.get('https://www.bitstamp.net/api/ticker/', function(err, response){
	console.log(response);
})
```