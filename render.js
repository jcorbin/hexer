'use strict';

function pad(c, s, width) {
    while (s.length < width) s = c + s;
    return s;
}

function byte2char(c) {
    if (c > 0x1f && c < 0x7f) {
        return String.fromCharCode(c);
    } else {
        return '.';
    }
    // TODO: could provide perhaps some unicode renderings for certain control chars
}

module.exports.pad = pad;
module.exports.byte2char = byte2char;
