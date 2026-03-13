const fs = require('fs');
const html = fs.readFileSync('august_source.html', 'utf8');

const fonts = html.match(/font-family:([^;"]+)/gi) || [];
console.log([...new Set(fonts)]);

const fontLinks = html.match(/<link[^>]+href="([^"]+fonts[^"]+)"/gi) || [];
console.log(fontLinks);
