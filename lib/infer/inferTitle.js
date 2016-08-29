'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inferTitle(url, callback) {
    var options = {
        url: url,
        headers: {
            // fake a user agent because pages like http://messenger.com will throw 404 error
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36'
        }
    };

    (0, _request2.default)(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            callback('Request Error: ' + error + ', Status Code ' + (response ? response.statusCode : 'No Response'));
            return;
        }

        var $ = _cheerio2.default.load(body);
        var pageTitle = $('title').first().text().replace(/\//g, '');
        callback(null, pageTitle);
    });
}

exports.default = inferTitle;
//# sourceMappingURL=inferTitle.js.map
