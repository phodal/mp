var wikiParser = require('wiki-infobox-parser');

wikiParser('Node.js', function(err, result) {
  if (err) {
    console.error(err.message);
  } else {
    console.log(result);
  }
});
