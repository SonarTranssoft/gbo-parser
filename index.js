const request = require('request');

const URL = 'https://www.mirgaza.ru/catalog/';

request(URL, function (err, res, body) {
    if (err) throw err;
    console.log(body);
    console.log(res.statusCode);
});