const fs = require('fs');
const sfnt2woff = require('sfnt2woff');

const buf = fs.readFileSync('firacode.ttf');
const woffBuf = sfnt2woff(buf);

fs.writeFileSync('firacode.woff', woffBuf);
