# CLI Usage

```shell
$ </bin/ls hexer
```

# API Usage

## Simple mode: buffer -> string

Got as buffer? We can render it:

```javascript
var hex = require('hexer');
console.log(hex(someBuffer));
```

## Simple streaming mode: in -> hex.Transform -> out

Got a stream? We can render it:

```javascript
var hex = require('hexer');
process.stdin
    .pipe(hex.Transform())
    .pipe(process.stdout);
```

## Chunked streaming mode: in -> hex.ChunkedTransform -> out

Got a stream? We can render each of its chunks:

```javascript
var hex = require('hexer');
process.stdin
    .pipe(hex.ChunkedTransform())
    .pipe(process.stdout);
```

## Advanced chunked streaming mode

Finally you can control the sessionization yourself if that makes sense:

```javascript
var hex = require('hexer');
var hexer = hex.Transform();
hexer.pipe(process.stdout);

process.stdin.on('data', function onData(chunk) {
    if (decideToReset(chunk)) {
        hexer.reset();
    }
    hexer.write(chunk);
});
```

However that example is a bit contrived, a more realistic example would be:

```javascript
var hex = require('hexer');
var hexer = hex.Transform();
hexer.pipe(process.stdout);

process.stdin.on('data', function onData(chunk) {
    var i = findBoundary(chunk);
    while (i > 0) {
        hexer.write(chunk.slice(0, i));
        hexer.reset();
        chunk = chunk.slice(i);
        i = findBoundary(chunk);
    }
    if (chunk.length) {
        hexer.write(chunk);
    }
});
```
