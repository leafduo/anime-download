var feedparser = require('feedparser')
  , child_process = require('child_process')
  ;

var links = [];

var handleArticle = function(article) {
    links.push(article.enclosures[0].url);
}

var addLinks = function() {
    var child = child_process.execFile('python', ['/Users/leafduo/bin/xunlei-lixian/lixian_cli.py', 'add', '--bt'].concat(links));
    child.stdout.pipe(process.stdout, { end: false });
    child.stderr.pipe(process.stderr, { end: false });
}

feedparser.parseUrl('http://share.dmhy.org/topics/rss/rss.xml')
  .on('article', handleArticle)
  .on('complete', addLinks);
