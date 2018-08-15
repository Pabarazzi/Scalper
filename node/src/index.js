const fastDomain = require('./common/util')
const nslookup = require('nslookup')
const dnsList = require('./common/CHINA-DNS')
const domain = 'www.228.com.cn'

let dnsIpList = []
dnsList.forEach((dns) => {
  // TODO 多线程
  nslookup(domain)
      .server(dns) // default is 8.8.8.8
      .type('a') // default is 'a'
      .timeout(10 * 1000) // default is 3 * 1000 ms
      .end(function (err, addrs) {
        dnsIpList = dnsIpList.concat(addrs)
      });
})

setTimeout(() => {
  dnsIpList = dnsIpList.filter(item => item !== undefined)
  fastDomain(domain, dnsIpList).then(result => console.log(result))
}, 3000)



