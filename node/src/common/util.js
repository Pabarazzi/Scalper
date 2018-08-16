var dns = require('dns')
var tcpp = require('tcp-ping')
var nslookup = require('nslookup')

const domainToIpV4Promise = async function (domain) {
  return new Promise((resolve, reject) => {
    if (!domain) {
      reject('Error, domain is null')
    }
    dns.resolve4(domain, (err, result) => {
      resolve(result)
    })
  })
}

const domainToIpV4 = async function (domain) {
  const result = await domainToIpV4Promise(domain)
  return result
}

/**
 * 探测
 * @param ip
 * @returns {Promise}
 * @constructor
 */
const TTL = function (ip) {
  return new Promise((resolve, reject) => {
    tcpp.ping({ address: ip }, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function lookupPromise(ip, domain) {
	return new Promise((resolve, reject) => {
		nslookup(domain)
			.server(ip) // default is 8.8.8.8
			.type('a') // default is 'a'
			.timeout(3 * 1000) // default is 3 * 1000 ms
			.end(function (err, addrs) {
				resolve(addrs)
			});
	})
}

/**
 * 排序
 * @param t1
 * @param t2
 * @returns {number}
 */
function compare (t1, t2) {
  return t1.avg - t2.avg
}

/**
 * 展开二维数组
 * @param arr
 * @returns {*}
 */
function formatArr(arr) {
	return arr.reduce((o, v) => {
		return o.concat(v)
	}, [])
}

function removeRepeat(arr) {
	return [... new Set(arr)]
}

/**
 *
 * @param domain 待解析的域名
 * @param dnsList 全国各省市dns地址列表
 * @returns {Promise.<T|*>}
 */
async function fastDomain(domain, dnsList) {
	let targetIpList = await Promise.all(dnsList.map((item) => lookupPromise(item, domain)))
	targetIpList = removeRepeat(formatArr(targetIpList)).filter(item => item !== void(0))
  const results = await Promise.all(targetIpList.map((item) => TTL(item)))
  return results.sort(compare)[0]
}



exports = module.exports = fastDomain
