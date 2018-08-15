const fastDomain = require('./common/util');
const nslookup = require('nslookup');
const domain = 'www.228.com.cn';
const DNS = require('./router/dns');


const dnsPromise = new DNS();

dnsPromise.then(instance => {
    console.log(instance.listServerIp());
}).catch(e => {
    console.log(e)
})
