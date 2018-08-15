// https://ip.cn/dns.html
var cheerio = require('cheerio');
var http = require('https');
var request = require('request');
var iconv = require('iconv-lite');
var url = 'ip.cn';

var cookie = 'UM_distinctid=16538bb079e376-0059c6ede905eb-163d6953-fa000-16538bb079f3bb; CNZZDATA123770=cnzz_eid%3D1080061441-1534250152-%26ntime%3D1534250152'

var options= {
  hostname: url,
  path: '/dns.html',
  method: 'get',
  headers: {
    //'Content-Type':'application/x-www-form-urlencoded',
    'Content-Type': 'application/json',
    'Cookie': cookie,
    'User-Agent': 'request'
  }
}

http.get(options, function(sres) {
  var chunks = [];
  sres.on('data', function(chunk) {
    chunks.push(chunk);
  });
  sres.on('end', function() {
    var titles = [];
    //由于咱们发现此网页的编码格式为gb2312，所以需要对其进行转码，否则乱码
    //依据：“<meta http-equiv="Content-Type" content="text/html; charset=gb2312">”
    var html = iconv.decode(Buffer.concat(chunks), 'utf-8');
    console.log(html)
    var $ = cheerio.load(html, {decodeEntities: false});
    $('.table-bordered tbody tr td:nth-of-type(2)').each(function (idx, element) {
      var $element = $(element);
      titles.push({
        title: $element.text()
      })
    })
    console.log(titles.map(item => item.title));
  });
});