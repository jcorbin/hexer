'use strict';

var color = require('ansi-color').set;

function pad(c, s, width) {
    while (s.length < width) s = c + s;
    return s;
}

function byte2hex(b) {
    return pad('0', b.toString(16), 2);
}

function byte2char(c) {
    if (c > 0x1f && c < 0x7f) {
        return String.fromCharCode(c);
    } else {
        return '.';
    }
    // TODO: could provide perhaps some unicode renderings for certain control chars
}

// istanbul ignore next
function renderColoredHuman(c) {
    if (c > 0x1f && c < 0x7f) {
        return String.fromCharCode(c);
    } else {
        return color('.', 'black+bold');
    }
}

module.exports.coloredHeadSep = color(':', 'cyan') + ' ';

module.exports.coloredOptions = {
    headSep: module.exports.coloredHeadSep,
    renderHuman: renderColoredHuman
};

module.exports.pad = pad;
module.exports.byte2hex = byte2hex;
module.exports.byte2char = byte2char;
module.exports.renderHuman = renderColoredHuman;
