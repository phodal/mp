const express = require('express');
const app = express();
const R = require('ramda');
const google = require('google');
const GitHubApi = require('github');
const request = require('request');
const github = new GitHubApi({});

google.lang = 'zh-cn';

let wechat = require('wechat');
let config = {
  token: process.env.TOKEN,
  appid: process.env.APP_ID,
  encodingAESKey: process.env.AESKey,
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

app.get('/', function (req, res) {
  res.send('玩点什么')
});

var updateItemField = function (item) {
  return ' ' + item[0] + ' ' + item[1] + ' ';
};

var updateWdsmItemField = function (item) {
  return ' ' + item[0] + ' https://www.wandianshenme.com/play/' + item[1] + ' ';
}

app.use(express.query());
app.use('/wechat', wechat(config, function (req, response, next) {
  let message = req.weixin;
  let content = R.toLower(message.Content);
  let phodal = message.FromUserName === 'oTISgjoVLyhB7g-w3_M0h20OASME';

  if (!phodal) {
    response.reply({
      content: '未完待续',
      type: 'text'
    });
  }

  console.log(content);
  if (R.startsWith('s ', content)) {
    let length = 'S '.length;
    let keyword = R.slice(length, Infinity, content);
    google(keyword, function (err, res) {
      let result = R.map(R.compose(updateItemField, R.values, R.pick(['title', 'link'])))(res.links);
      response.reply('你想要搜索的结果可能是： ' + result);
    });
  } else if (R.startsWith('g ', content)) {
    let length = 'G '.length;
    let keyword = R.slice(length, Infinity, content);
    github.search.repos({
      q: keyword + '+user:phodal',
      sort: 'stars',
      order: 'desc'
    }, function (err, res) {
      if (err) throw err;
      const data = res.data.items;
      var result = R.map(R.compose(updateItemField, R.values, R.pick(['name', 'html_url'])))(data);
      response.reply('你想要搜索的结果可能是： ' + result);
    });
  } else if (R.startsWith('s ', content)) {
    request.get('https://www.wandianshenme.com/api/play/?query=AI', {
      headers: {
        'User-Agent': 'google'
      }
    }, function (error, response, body) {
      if (response.statusCode === 200) {
        const data = JSON.parse(body).results;
        var result = R.map(R.compose(updateWdsmItemField, R.values, R.pick(['title', 'slug'])))(data);
        response.reply({
          content: result,
          type: 'text'
        });
      }
    });
  } else {
    response.reply({
      content: '未完待续',
      type: 'text'
    });
  }
}));

// app.listen(8080);
module.exports = app;
