var wikiParser = require('wiki-infobox-parser');
const R = require('ramda');

wikiParser('Node.js', function(err, result) {
  if (err) {
    console.error(err.message);
  } else {
    console.log(R.values(JSON.parse(result)));
  }
});
