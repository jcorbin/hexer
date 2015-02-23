'use strict';

var util = require('util');
var HexTransform = require('./hex_transform');

function ChunkedHexTransform(options) {
    if (!(this instanceof ChunkedHexTransform)) {
        return new ChunkedHexTransform(options);
    }
    HexTransform.call(this, options);
    var self = this;
    self.header = options.header || simpleHeader;
    self.chunkNum = 0;
}
util.inherits(ChunkedHexTransform, HexTransform);

ChunkedHexTransform.prototype._transform = function transform(chunk, encoding, done) {
    var self = this;
    if (self.totalOffset) {
        self.reset();
    }

    ++self.chunkNum;
    var header = self.header(self.chunkNum, chunk);
    if (header.length) {
        self.push(header);
    }

    HexTransform.prototype._transform.call(self, chunk, encoding, function subDone(err) {
        self.reset();
        done(err);
    });
};

function simpleHeader(chunkNum, chunk) {
    var len = chunk.length;
    var hexlen = len.toString(16);
    return util.format(
        '-- chunk[%s] length: %s (0x%s)\n',
        chunkNum, len, hexlen);
}

module.exports = ChunkedHexTransform;
