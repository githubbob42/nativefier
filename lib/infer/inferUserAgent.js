'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getUserAgentString = getUserAgentString;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ELECTRON_VERSIONS_URL = 'https://atom.io/download/atom-shell/index.json';
var DEFAULT_CHROME_VERSION = '47.0.2526.73';

function getChromeVersionForElectronVersion(electronVersion) {
    var url = arguments.length <= 1 || arguments[1] === undefined ? ELECTRON_VERSIONS_URL : arguments[1];

    return _axios2.default.get(url, { timeout: 5000 }).then(function (response) {
        if (response.status !== 200) {
            throw 'Bad request: Status code ' + response.status;
        }

        var data = response.data;
        var electronVersionToChromeVersion = _lodash2.default.zipObject(data.map(function (d) {
            return d.version;
        }), data.map(function (d) {
            return d.chrome;
        }));

        if (!(electronVersion in electronVersionToChromeVersion)) {
            throw 'Electron version \'' + electronVersion + '\' not found in retrieved version list!';
        }

        return electronVersionToChromeVersion[electronVersion];
    });
}

function getUserAgentString(chromeVersion, platform) {
    var userAgent = void 0;
    switch (platform) {
        case 'darwin':
            userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/' + chromeVersion + ' Safari/537.36';
            break;
        case 'win32':
            userAgent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/' + chromeVersion + ' Safari/537.36';
            break;
        case 'linux':
            userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/' + chromeVersion + ' Safari/537.36';
            break;
        default:
            throw 'Error invalid platform specified to getUserAgentString()';
    }
    return userAgent;
}

function inferUserAgent(electronVersion, platform) {
    var url = arguments.length <= 2 || arguments[2] === undefined ? ELECTRON_VERSIONS_URL : arguments[2];

    return getChromeVersionForElectronVersion(electronVersion, url).then(function (chromeVersion) {
        return getUserAgentString(chromeVersion, platform);
    }).catch(function () {
        _loglevel2.default.warn('Unable to infer chrome version for user agent, using ' + DEFAULT_CHROME_VERSION);
        return getUserAgentString(DEFAULT_CHROME_VERSION, platform);
    });
}

exports.default = inferUserAgent;
//# sourceMappingURL=inferUserAgent.js.map
