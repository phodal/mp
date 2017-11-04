const express = require('express');
const app = express();
const R = require('ramda');
const google = require('google');
const GitHubApi = require('github');
const request = require('request');
const github = new GitHubApi({});
const wikiParser = require('wiki-infobox-parser');

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
  return ' 《' + item[0] + '》 ' + item[1] + ' ';
};

var updateWdsmItemField = function (item) {
  return ' 《' + item[0] + '》 https://www.wandianshenme.com/play/' + item[1] + ' ';
};

var updatePhodalItemField = function (item) {
  return ' 《' + item[0] + '》 https://www.phodal.com/blog/' + item[1] + ' ';
};

app.use(express.query());
app.use('/wechat', wechat(config, function (req, response, next) {
  let message = req.weixin;
  let content = R.toLower(message.Content);
  let phodal = message.FromUserName === 'oTISgjoVLyhB7g-w3_M0h20OASME';

  // if (!phodal) {
  //   response.reply({
  //     content: '未完待续',
  //     type: 'text'
  //   });
  // }

  console.log(content);
  if (R.startsWith('s ', content)) {
    let length = 's '.length;
    let keyword = R.slice(length, Infinity, content);
    google(keyword, function (err, res) {
      let result = R.map(R.compose(updateItemField, R.values, R.pick(['title', 'link'])))(res.links);
      response.reply('你想要在 Google 上搜索的内容有： ' + result);
    });
  } else if (R.startsWith('g ', content)) {
    let length = 'g '.length;
    let keyword = R.slice(length, Infinity, content);
    github.search.repos({
      q: keyword + '+user:phodal',
      sort: 'stars',
      order: 'desc'
    }, function (err, res) {
      if (err) throw err;
      const data = res.data.items;
      var result = R.map(R.compose(updateItemField, R.values, R.pick(['name', 'html_url'])))(data);
      response.reply('你想要在 GitHub 上搜索的内容有： ' + result);
    });
  } else if (R.startsWith('wiki ', content)) {
    let length = 'wiki '.length;
    let keyword = R.slice(length, Infinity, content);
    wikiParser(keyword, function(err, result) {
      if (err) {
        response.reply('Error' + err.message);
      } else {
        response.reply('在 Wiki 上搜索的内容有： ' + R.values(JSON.parse(result)));
      }
    });

  } else if (R.startsWith('w ', content)) {
    let length = 'w '.length;
    let keyword = R.slice(length, Infinity, content);
    request.get('https://www.wandianshenme.com/api/play/?search=' + keyword, {
      headers: {
        'User-Agent': 'google'
      }
    }, function (error, res, body) {
      if (res.statusCode === 200) {
        let parsed = JSON.parse(body);
        const data = parsed.results;
        const count = parsed.count;
        var result = R.map(R.compose(updateWdsmItemField, R.values, R.pick(['title', 'slug'])))(data);
        response.reply({
          content: '在『玩点什么』上有' + count + '个结果，前 10 个如下：' + result,
          type: 'text'
        });
      }
    });
  } else if (R.startsWith('p ', content)) {
    let length = 'p '.length;
    let keyword = R.slice(length, Infinity, content);
    request.get('https://www.phodal.com/api/app/blog_detail/?search=' + keyword, {
      headers: {
        'User-Agent': 'google'
      }
    }, function (error, res, body) {
      if (res.statusCode === 200) {
        let parsed = JSON.parse(body);
        const data = parsed;
        var result = R.map(R.compose(updatePhodalItemField, R.values, R.pick(['title', 'slug'])))(data);
        response.reply({
          content: '在『 phodal.com 』上有 x 个结果，前 10 个如下：' + result,
          type: 'text'
        });
      }
    });
  } else {
    response.reply({
      content: '需要帮助，添加微信号：growth-ren。当前仅支持 GitHub（g）、玩点什么（w）、Phodal（p）、维基百科（wiki）的搜索功能，『p 』用于搜索 我的博客，『w 』开头用于搜索玩点什么；如使用 "g iot" 在 GitHub 上搜索我的相关项目。有其它需求请在： https://github.com/phodal/phodal-mp  上提建议。',
      type: 'text'
    });
  }
}));

// app.listen(8080);
module.exports = app;
