const request = require('request');
const R = require('ramda');

request.get('https://www.wandianshenme.com/api/play/?query=AI', {
    headers: {
      'User-Agent': 'google'
    }
  }, function (error, response, body) {
    if (response.statusCode === 200) {
      var updateItemField = function(item) {
        return '标题：' + item[0] + ' 链接：' + item[1] + ' ';
      }
      console.log(body.results);
      var s = R.map(R.compose(updateItemField, R.values, R.pick(['title', 'slug'])))(body.results);
      console.log(s);
    }
  }
);
