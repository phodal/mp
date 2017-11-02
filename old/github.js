const GitHubApi = require('github');
const github = new GitHubApi({});
const R = require('ramda');

github.search.repos({
  q: 'github' + '+user:phodal',
  sort: 'stars',
  order: 'desc'
}, function (err, res) {
  if (err) throw err;
  const data = res.data.items;
  var s = R.map(R.compose(R.values, R.pick(['name', 'html_url'])))(data);
});
