"use strict";

hex.Transform = require('./hex_transform');
hex.ChunkedTransform = require('./chunked_hex_transform');
hex.Spy = require('./hex_spy');

module.exports = hex;

function hex(buffer, options) {
    options = options || {};
    if (!options.offsetWidth) {
        options.offsetWidth = 2 * Math.ceil(buffer.length.toString(16).length / 2);
    }
    var stream = hex.Transform(options);
    stream.write(buffer);
    stream.end();
    var out = stream.read();
    if (out === null) {
        return '';
    }
    out = String(out);
    out = out.replace(/\n+$/, '');
    return out;
}
