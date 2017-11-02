const request = require('request');
const R = require('ramda');

request.get('https://www.wandianshenme.com/api/play/?query=AI', {
    headers: {
      'User-Agent': 'google'
    }
  }, function (error, response, body) {
    if (response.statusCode === 200) {
      var updateItemField = function(item) {
        return ' ' + item[0] + ' https://www.wandianshenme.com/play/' + item[1] + ' ';
      }
      const data = JSON.parse(body).results;
      var s = R.map(R.compose(updateItemField, R.values, R.pick(['title', 'slug'])))(data);
      console.log(s);
    }
  }
);
