"use strict";

hex.Transform = require('./hex_transform');
hex.ChunkedTransform = require('./chunked_hex_transform');

module.exports = hex;

function hex(buffer, options) {
    options = options || {};
    if (!options.offsetWidth) {
        options.offsetWidth = 2 * Math.ceil(buffer.length.toString(16).length / 2);
    }
    var stream = hex.Transform(options);
    stream.write(buffer);
    stream.end();
    var out = String(stream.read());
    out = out.replace(/\n+$/, '');
    return out;
}
