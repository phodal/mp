基于 Serverless 的 Phodal's 微信公共平台
===


Features
---

 - Google（仅对 Phodal 开放）
 - GitHub 搜索
 - 玩点什么搜索
 - Phodal 搜索
 - Wiki 信息框搜索

Install
---

``要求``： 首先你需要有一个 AWS 账号


1.Install Services

```
serverless install -u https://github.com/phodal/mp -mp
```

2. Install Deps

```
yarn install
```

3.Create config

```
cp config.yml.template config.yml
```

change it

4.config Route53

follow: [Serverless 应用开发指南： API Gateway 与 Route53 自定义域名](https://www.phodal.com/blog/serverless-development-guide-api-gateway-and-route53-custom-domain/)

5.Deploy

```
serverless deploy
```

6.Logs


```
serverless logs -f runserver -t
```

LICENSE
---

[![Phodal's Idea](http://brand.phodal.com/shields/idea-small.svg)](http://ideas.phodal.com/)

© 2017 A [Phodal Huang](https://www.phodal.com)'s [Idea](http://github.com/phodal/ideas).  This code is distributed under the MIT license. See `LICENSE` in this directory.
