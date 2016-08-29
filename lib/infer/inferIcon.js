'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pageIcon = require('page-icon');

var _pageIcon2 = _interopRequireDefault(_pageIcon);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

var _gitcloud = require('gitcloud');

var _gitcloud2 = _interopRequireDefault(_gitcloud);

var _helpers = require('./../helpers/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var downloadFile = _helpers2.default.downloadFile;
var allowedIconFormats = _helpers2.default.allowedIconFormats;

_tmp2.default.setGracefulCleanup();

var GITCLOUD_SPACE_DELIMITER = '-';

function inferIconFromStore(targetUrl, platform) {
    var allowedFormats = allowedIconFormats(platform);

    return (0, _gitcloud2.default)('http://jiahaog.com/nativefier-icons/').then(function (fileIndex) {
        var iconWithScores = mapIconWithMatchScore(fileIndex, targetUrl);
        var maxScore = getMaxMatchScore(iconWithScores);

        if (maxScore === 0) {
            return null;
        }

        var matchingIcons = getMatchingIcons(iconWithScores, maxScore);

        var matchingUrl = void 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = allowedFormats[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var format = _step.value;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = matchingIcons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var icon = _step2.value;

                        if (icon.ext !== format) {
                            continue;
                        }
                        matchingUrl = icon.url;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (!matchingUrl) {
            return null;
        }
        return downloadFile(matchingUrl);
    });
}

function mapIconWithMatchScore(fileIndex, targetUrl) {
    var normalisedTargetUrl = targetUrl.toLowerCase();
    return fileIndex.map(function (item) {
        var itemWords = item.name.split(GITCLOUD_SPACE_DELIMITER);
        var score = itemWords.reduce(function (currentScore, word) {
            if (normalisedTargetUrl.includes(word)) {
                return currentScore + 1;
            }
            return currentScore;
        }, 0);

        return Object.assign({}, item, { score: score });
    });
}

function getMaxMatchScore(iconWithScores) {
    return iconWithScores.reduce(function (maxScore, currentIcon) {
        var currentScore = currentIcon.score;
        if (currentScore > maxScore) {
            return currentScore;
        }
        return maxScore;
    }, 0);
}

/**
 * also maps ext to icon object
 */
function getMatchingIcons(iconWithScores, maxScore) {
    return iconWithScores.filter(function (item) {
        return item.score === maxScore;
    }).map(function (item) {
        return Object.assign({}, item, { ext: _path2.default.extname(item.url) });
    });
}

function writeFilePromise(outPath, data) {
    return new Promise(function (resolve, reject) {
        _fs2.default.writeFile(outPath, data, function (error) {
            if (error) {
                reject(error);
                return;
            }
            resolve(outPath);
        });
    });
}

function inferFromPage(targetUrl, platform, outDir) {
    var preferredExt = '.png';
    if (platform === 'win32') {
        preferredExt = '.ico';
    }

    // todo might want to pass list of preferences instead
    return (0, _pageIcon2.default)(targetUrl, { ext: preferredExt }).then(function (icon) {
        if (!icon) {
            return null;
        }

        var outfilePath = _path2.default.join(outDir, '/icon' + icon.ext);
        return writeFilePromise(outfilePath, icon.data);
    });
}
/**
 *
 * @param {string} targetUrl
 * @param {string} platform
 * @param {string} outDir
 */
function inferIconFromUrlToPath(targetUrl, platform, outDir) {

    return inferIconFromStore(targetUrl, platform).then(function (icon) {
        if (!icon) {
            return inferFromPage(targetUrl, platform, outDir);
        }

        var outfilePath = _path2.default.join(outDir, '/icon' + icon.ext);
        return writeFilePromise(outfilePath, icon.data);
    });
}

/**
 * @param {string} targetUrl
 * @param {string} platform
 */
function inferIcon(targetUrl, platform) {
    var tmpObj = _tmp2.default.dirSync({ unsafeCleanup: true });
    var tmpPath = tmpObj.name;
    return inferIconFromUrlToPath(targetUrl, platform, tmpPath);
}

exports.default = inferIcon;
//# sourceMappingURL=inferIcon.js.map
