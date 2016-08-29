'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalizeUrl(testUrl) {
    // add protocol if protocol not found
    var normalized = testUrl;
    var parsed = _url2.default.parse(normalized);
    if (!parsed.protocol) {
        normalized = 'http://' + normalized;
    }
    if (!_validator2.default.isURL(normalized, { require_protocol: true, require_tld: false })) {
        throw 'Your Url: "' + normalized + '" is invalid!';
    }
    return normalized;
}

exports.default = normalizeUrl;
//# sourceMappingURL=normalizeUrl.js.map
