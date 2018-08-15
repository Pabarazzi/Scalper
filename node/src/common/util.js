var dns = require('dns')
var tcpp = require('tcp-ping')

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

function compare (t1, t2) {
  return t1.avg - t2.avg
}

/**
 *
 * @param domain 待解析的域名
 * @param dnsList 全国各省市dns地址列表
 * @returns {Promise.<T|*>}
 */
async function fastDomain(domain, dnsList) {
  if (!domain) return
  const promises = dnsList.map((item) => TTL(item))
  const results = await Promise.all(promises)
  return results.sort(compare)[0]
}



exports = module.exports = fastDomain