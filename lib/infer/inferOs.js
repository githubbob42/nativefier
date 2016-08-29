'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inferPlatform() {
    var platform = _os2.default.platform();
    if (platform === 'darwin' || platform === 'win32' || platform === 'linux') {
        return platform;
    }

    throw 'Untested platform ' + platform + ' detected';
}

function inferArch() {
    var arch = _os2.default.arch();
    if (arch !== 'ia32' && arch !== 'x64') {
        throw 'Incompatible architecture ' + arch + ' detected';
    }
    return arch;
}

exports.default = {
    inferPlatform: inferPlatform,
    inferArch: inferArch
};
//# sourceMappingURL=inferOs.js.map
