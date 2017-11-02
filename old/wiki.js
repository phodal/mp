const request = require('request');
const querystring = require('querystring');

var queryParams = {
  action: "query",
  format: "json",
  prop: "revisions",
  rvprop: "content",
  titles: "红楼梦",
  redirects: 1
};

console.log(querystring.stringify(queryParams))

request.get('https://zh.wikipedia.org/w/api.php?' + querystring.stringify(queryParams), {
    headers: {
      'User-Agent': 'google'
    }
  }, function (error, response, body) {
    if (response.statusCode === 200) {
      const wiki = JSON.parse(body);
      if (wiki.query && wiki.query.pages) {
        var keys = Object.keys(wiki.query.pages);
        if (keys.length > 0) {

          if (!wiki.query.pages[keys[0]].revisions) {
            return;
          }

          var latestArticle = wiki.query.pages[keys[0]].revisions[0]["*"];
          console.log(latestArticle);
        }
      }
    }
  }
);

