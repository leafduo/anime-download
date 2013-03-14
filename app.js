var feedparser = require('feedparser')
  , child_process = require('child_process')
  , fs = require('fs')
  , colors = require('colors')
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
    var nextLoop = function() {
        console.log('Wait for next fetch'.green);
        setTimeout(function() {
            parse()
        }, 600*1000);
    };

    if (!links.length) {
        console.log('No download will be added.');
        nextLoop();
    } else {
        var child = child_process.execFile('xunlei-lixian/lixian_cli.py', ['add', '--bt'].concat(links), nextLoop);
        child.stdout.pipe(process.stdout, { end: false });
        child.stderr.pipe(process.stderr, { end: false });
    }
}

function loadRegularExpressions() {
    res = fs.readFileSync('re.txt').toString('utf-8').split(/\r?\n/);
    res = res.filter(function(element) {
        return element.length;
    });
    res = res.map(function(element) {
        return RegExp(element);
    });
    console.log('Regular expressions:'.green);
    console.log(res);
}

function parse() {
    console.log('Anime to download:'.green);
    feedparser.parseUrl('http://share.dmhy.org/topics/rss/rss.xml')
    .on('article', handleArticle)
    .on('complete', addLinks);
}

loadRegularExpressions();
parse();
