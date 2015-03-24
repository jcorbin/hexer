"use strict";

var util = require('util');
var Transform = require('stream').Transform;

function HexTransform(options) {
    if (!(this instanceof HexTransform)) {
        return new HexTransform(options);
    }
    // istanbul ignore next
    if (!options) options = {};
    Transform.call(this, options);
    var self = this;
    self.options = options;
    self.prefix = self.options.prefix || '';
    self.cols = self.options.cols || 16;
    self.group = self.options.group || 2;
    self.gutter = self.options.gutter || 0;
    self.decorateHexen = self.options.decorateHexen || noopDecorate;
    self.decorateHuman = self.options.decorateHuman || noopDecorate;
    self.renderHuman = self.options.renderHuman || byte2char;
    // istanbul ignore next
    self.groupSeparator = self.options.groupSeparator === undefined ? ' ' : self.options.groupSeparator;
    // istanbul ignore next
    self.headSep = self.options.headSep === undefined ? ': ' : self.options.headSep;
    // istanbul ignore next
    self.divide = self.options.divide === undefined ? '  ' : self.options.divide;
    // istanbul ignore next
    self.emptyHexen = self.options.emptyHexen === undefined ? '  ' : self.options.emptyHexen;
    self.emptyHuman = self.options.emptyHuman || '';
    self.nullHuman = self.options.nullHuman || '';
    self.offsetWidth = self.options.offsetWidth || 8;
    self.gutter = Math.max(self.offsetWidth, self.gutter);
    self.line = '';
    self.hexen = '';
    self.human = '';
    self.reset();
}
util.inherits(HexTransform, Transform);

HexTransform.prototype.reset = function reset() {
    var self = this;
    self._finishLine();
    self.screenOffset = 0;
    self.totalOffset = 0;
};

HexTransform.prototype._transform = function transform(chunk, encoding, done) {
    var self = this;
    for (var offset=0; offset<chunk.length; offset++) {
        if (self.screenOffset % self.cols === 0) {
            self._finishLine();
            self._startLine();
        }
        self._addByte(chunk[offset]);
    }
    done(null);
};

HexTransform.prototype._flush = function flush(done) {
    var self = this;
    if (self.totalOffset === 0 && self.nullHuman) {
        self._startLine();
        self.human += self.nullHuman;
    }
    self._finishLine();
    done(null);
};

HexTransform.prototype._startLine = function startLine() {
    var self = this;
    var head = pad('0', self.totalOffset.toString(16), self.offsetWidth);
    self.line = self.prefix + pad(' ', head, self.gutter) + self.headSep;
};

HexTransform.prototype._finishLine = function finishLine() {
    var self = this;
    if (self.line.length) {
        var rem = self.screenOffset % self.cols;
        if (rem !== 0 || (self.totalOffset === 0 && self.nullHuman)) {
            rem = self.cols - rem;
            for (var i=0; i<rem; i++) {
                self._addEmpty();
            }
        }
        self.line += self.hexen + self.divide + self.human + '\n';
        self.push(self.line);
        self.line = '';
        self.hexen = '';
        self.human = '';
    }
};

HexTransform.prototype._addEmpty = function addEmpty() {
    var self = this;
    self._addPart(self.emptyHexen, self.emptyHuman);
};

HexTransform.prototype._addByte = function addByte(b) {
    var self = this;
    self._addPart(pad('0', b.toString(16), 2), self.renderHuman(b), b);
};

HexTransform.prototype._addPart = function addByte(hexen, human, b) {
    var self = this;
    hexen = self.decorateHexen(self.totalOffset, self.screenOffset, hexen, b);
    human = self.decorateHuman(self.totalOffset, self.screenOffset, human, b);
    var isStartOfRow = self.screenOffset % self.cols === 0;
    var isStartOfGroup = self.screenOffset % self.group === 0;
    if (!isStartOfRow && isStartOfGroup) {
        self.hexen += self.groupSeparator;
    }
    self.hexen += hexen;
    self.human += human;
    self.totalOffset++;
    self.screenOffset++;
};

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

function noopDecorate(offset, screenOffset, s) {
    return s;
}

module.exports = HexTransform;
