const fastDomain = require('./common/util');
const domain = 'www.228.com.cn';
const DNS = require('./router/dns');

const dnsPromise = new DNS();

async function getFastDomain() {
	const instance = await dnsPromise
	const dnsList = instance.listServerIp().map(item => item.vip)
	fastDomain(domain, dnsList).then(result => console.log(result))
}

getFastDomain()

// dnsPromise.then(instance => {
// 	const dnsList = instance.listServerIp().map(item => item.vip)
// 	fastDomain(domain, dnsList).then(result => console.log(result))
// }).catch(e => {
// 	console.log(e)
// })

