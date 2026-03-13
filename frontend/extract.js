const fs = require('fs');
const html = fs.readFileSync('august_source.html', 'utf8');

// Find all SVGs
const svgs = html.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi) || [];
console.log("--- FOUND SVGs ---");
svgs.forEach((svg, i) => {
    if (svg.length < 5000) { // skip massive inline svgs
        console.log(`\nSVG ${i}:`, svg);
    }
});

// Find all Hex colors
const colors = [...new Set(html.match(/#[0-9a-fA-F]{6}/g))];
console.log("\n--- FOUND COLORS ---");
console.log(colors);

// Look for image sources
const imgs = html.match(/<img[^>]+src="([^">]+)"/gi) || [];
console.log("\n--- FOUND IMAGES ---");
imgs.forEach((img, i) => console.log(`IMG ${i}:`, img));
