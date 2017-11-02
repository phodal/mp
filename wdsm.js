var request = require('request');

request
  .get('https://www.wandianshenme.com/api/play/?query=AI', {
  	headers: {
    'User-Agent': 'google'
    }
  }, function (error, response, body) {
      if(response.statusCode == 201){
        console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand)
      } else {
        console.log('error: '+ response.statusCode)
        console.log(body)
      }
    }
  )