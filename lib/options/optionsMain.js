'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _sanitizeFilename = require('sanitize-filename');

var _sanitizeFilename2 = _interopRequireDefault(_sanitizeFilename);

var _inferIcon = require('./../infer/inferIcon');

var _inferIcon2 = _interopRequireDefault(_inferIcon);

var _inferTitle = require('./../infer/inferTitle');

var _inferTitle2 = _interopRequireDefault(_inferTitle);

var _inferOs = require('./../infer/inferOs');

var _inferOs2 = _interopRequireDefault(_inferOs);

var _inferUserAgent = require('./../infer/inferUserAgent');

var _inferUserAgent2 = _interopRequireDefault(_inferUserAgent);

var _normalizeUrl = require('./normalizeUrl');

var _normalizeUrl2 = _interopRequireDefault(_normalizeUrl);

var _package = require('./../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inferPlatform = _inferOs2.default.inferPlatform;
var inferArch = _inferOs2.default.inferArch;


var PLACEHOLDER_APP_DIR = _path2.default.join(__dirname, '../../', 'app');
var ELECTRON_VERSION = '1.1.3';

var DEFAULT_APP_NAME = 'APP';

/**
 * @callback optionsCallback
 * @param error
 * @param options augmented options
 */

/**
 * Extracts only desired keys from inpOptions and augments it with defaults
 * @param inpOptions
 * @param {optionsCallback} callback
 */
function optionsFactory(inpOptions, callback) {

    var options = {
        'app-version': inpOptions.appVersion,
        'build-version': inpOptions.buildVersion,
        'app-copyright': inpOptions.appCopyright,
        win32metadata: inpOptions.win32metadata,
        'version-string': inpOptions.versionString,
        dir: PLACEHOLDER_APP_DIR,
        name: inpOptions.name,
        targetUrl: (0, _normalizeUrl2.default)(inpOptions.targetUrl),
        platform: inpOptions.platform || inferPlatform(),
        arch: inpOptions.arch || inferArch(),
        version: inpOptions.electronVersion || ELECTRON_VERSION,
        nativefierVersion: _package2.default.version,
        out: inpOptions.out || process.cwd(),
        overwrite: inpOptions.overwrite,
        asar: inpOptions.conceal || false,
        icon: inpOptions.icon,
        counter: inpOptions.counter || false,
        width: inpOptions.width || 1280,
        height: inpOptions.height || 800,
        minWidth: inpOptions.minWidth,
        minHeight: inpOptions.minHeight,
        maxWidth: inpOptions.maxWidth,
        maxHeight: inpOptions.maxHeight,
        showMenuBar: inpOptions.showMenuBar || false,
        fastQuit: inpOptions.fastQuit || false,
        userAgent: inpOptions.userAgent,
        ignoreCertificate: inpOptions.ignoreCertificate || false,
        insecure: inpOptions.insecure || false,
        flashPluginDir: inpOptions.flashPath || inpOptions.flash || null,
        inject: inpOptions.inject || null,
        ignore: 'src',
        fullScreen: inpOptions.fullScreen || false,
        maximize: inpOptions.maximize || false,
        hideWindowFrame: inpOptions.hideWindowFrame,
        verbose: inpOptions.verbose,
        disableContextMenu: inpOptions.disableContextMenu,
        disableDevTools: inpOptions.disableDevTools,
        // workaround for electron-packager#375
        tmpdir: false,
        zoom: inpOptions.zoom || 1.0,
        internalUrls: inpOptions.internalUrls || null
    };

    if (options.verbose) {
        _loglevel2.default.setLevel('trace');
    } else {
        _loglevel2.default.setLevel('error');
    }

    if (options.flashPluginDir) {
        options.insecure = true;
    }

    if (inpOptions.honest) {
        options.userAgent = null;
    }

    if (options.platform.toLowerCase() === 'windows') {
        options.platform = 'win32';
    }

    if (options.platform.toLowerCase() === 'osx' || options.platform.toLowerCase() === 'mac') {
        options.platform = 'darwin';
    }

    if (options.width > options.maxWidth) {
        options.width = options.maxWidth;
    }

    if (options.height > options.maxHeight) {
        options.height = options.maxHeight;
    }

    _async2.default.waterfall([function (callback) {
        if (options.userAgent) {
            callback();
            return;
        }
        (0, _inferUserAgent2.default)(options.version, options.platform).then(function (userAgent) {
            options.userAgent = userAgent;
            callback();
        }).catch(callback);
    }, function (callback) {
        if (options.icon) {
            callback();
            return;
        }
        (0, _inferIcon2.default)(options.targetUrl, options.platform).then(function (pngPath) {
            options.icon = pngPath;
            callback();
        }).catch(function (error) {
            _loglevel2.default.warn('Cannot automatically retrieve the app icon:', error);
            callback();
        });
    }, function (callback) {
        // length also checks if its the commanderJS function or a string
        if (options.name && options.name.length > 0) {
            callback();
            return;
        }

        (0, _inferTitle2.default)(options.targetUrl, function (error, pageTitle) {
            if (error) {
                _loglevel2.default.warn('Unable to automatically determine app name, falling back to \'' + DEFAULT_APP_NAME + '\'');
                options.name = DEFAULT_APP_NAME;
            } else {
                options.name = pageTitle.trim();
            }
            if (options.platform === 'linux') {
                // spaces will cause problems with Ubuntu when pinned to the dock
                options.name = _lodash2.default.kebabCase(options.name);
            }
            callback();
        });
    }], function (error) {
        callback(error, sanitizeOptions(options));
    });
}

function sanitizeFilename(str) {
    var cleaned = (0, _sanitizeFilename2.default)(str);
    // remove all non ascii or use default app name
    return cleaned.replace(/[^\x00-\x7F]/g, '') || DEFAULT_APP_NAME;
}

function sanitizeOptions(options) {
    options.name = sanitizeFilename(options.name);
    return options;
}

exports.default = optionsFactory;
//# sourceMappingURL=optionsMain.js.map
