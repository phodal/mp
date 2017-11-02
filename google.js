const google = require('google');
const R = require('ramda');

google.lang = 'zh-cn';

google('phodal', function (err, res){
  console.log(res.links);

  var s = R.map(R.compose(R.values, R.pick(['title', 'link'])))(res.links);
});
