const express = require('express');
const app = express();
const R = require('ramda');
const google = require('google');
const GitHubApi = require('github');
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

app.use(express.query());
app.use('/wechat', wechat(config, function (req, response, next) {
  let message = req.weixin;
  let content = message.Content;
  let phodal = message.FromUserName === 'oTISgjoVLyhB7g-w3_M0h20OASME';

  console.log(content);
  if (R.startsWith('G ', content) || R.startsWith('g ', content)) {
    let length = 'G '.length;
    let keyword = R.slice(length, Infinity, content);
    google(keyword, function (err, res) {
      let result = R.map(R.compose(R.values, R.pick(['title', 'link'])))(res.links);
      response.reply('你想要搜索的结果可能是： ' + result);
    });
  } else if (R.startsWith('Git ', content) || R.startsWith('git ', content)) {
    let length = 'Git '.length;
    let keyword = R.slice(length, Infinity, content);
    github.search.repos({
      q: keyword + '+user:phodal',
      sort: 'stars',
      order: 'desc'
    }, function (err, res) {
      if (err) throw err;
      const data = res.data.items;
      var result = R.map(R.compose(R.values, R.pick(['name', 'html_url'])))(data);
      response.reply('你想要搜索的结果可能是： ' + result);
    });
  } else {
    res.reply({
      content: '未完待续',
      type: 'text'
    });
  }
}));

// app.listen(8080);
module.exports = app;
