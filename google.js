let google = require('google');
google.lang = 'zh-cn';

google('phodal', function (err, res){
  console.log(res.links);
});
