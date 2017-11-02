const google = require('google');
const R = require('ramda');

google.lang = 'zh-cn';
google.nextText = 'zh-cn';

google('phodal', function (err, res){
  var updateItemField = function(item) {
    return '标题：' + item[0] + ' 链接：' + item[1] + ' ';
  }
  var s = R.map(R.compose(updateItemField, R.values, R.pick(['title', 'link'])))(res.links);
  console.log(s);
});
