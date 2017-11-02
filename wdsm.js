let request = require('request');

request.get('https://www.wandianshenme.com/api/play/?query=AI', {
    headers: {
      'User-Agent': 'google'
    }
  }, function (error, response, body) {
    if (response.statusCode === 200) {
      console.log('error: ' + response.statusCode);
      console.log(body)
    }
  }
);
