var feedparser = require('feedparser')
  , child_process = require('child_process')
  , fs = require('fs')
  ;

var links = [];
var res = [];

var handleArticle = function(article) {
    var ok = res.some(function(element, index, array) {
        return element.test(article.title);
    });
    if (ok) {
        console.log(article.title);
        links.push(article.enclosures[0].url);
    }
}

var addLinks = function() {
    if (!links.length) {
        console.log('No download will be added.');
        return;
    }
    var child = child_process.execFile('python', ['/Users/leafduo/bin/xunlei-lixian/lixian_cli.py', 'add', '--bt'].concat(links));
    child.stdout.pipe(process.stdout, { end: false });
    child.stderr.pipe(process.stderr, { end: false });
}

function loadRegularExpressions() {
    res = fs.readFileSync('re.txt').toString('utf-8').split(/\r?\n/);
    res = res.filter(function(element) {
        return element.length;
    });
    res = res.map(function(element) {
        return RegExp(element);
    });
    console.log(res);
}

loadRegularExpressions()

feedparser.parseUrl('http://share.dmhy.org/topics/rss/rss.xml')
  .on('article', handleArticle)
  .on('complete', addLinks);
