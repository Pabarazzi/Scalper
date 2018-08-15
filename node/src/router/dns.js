'use strict';

let request = require('request-promise-native');

module.exports = DNS;

function DNS() {

    let owner = this;

    return fetchAndUpdateMetaInfo().then(content => {
        owner.regionToServerIpList = content.data;
        this.listServerIp = () => Array.prototype.concat.apply([], owner.regionToServerIpList.map(it => flattenRegionInfo(it)));

        return owner;
    }).catch(e => {
        throw new Error("Fetch DNSMeta Failed: " + e);
    });
}

function flattenRegionInfo(regionInfo) {
    return regionInfo.info.map(v => Object.assign({region: regionInfo.view_name}, v))
}

async function fetchAndUpdateMetaInfo() {
    let options = {
        method: 'POST',
        uri: 'http://tools.cloudxns.net/Index/infocontent',
        form: 'isp_name=电信,网通,移动,铁通,长宽,教育网,科技网,&city_name=辽宁,吉林,黑龙江,北京,天津,河北,山西,内蒙古,山东,陕西,甘肃,青海,宁夏,新疆,重庆,四川,贵州,云南,西藏,河南,湖北,湖南,上海,江苏,浙江,安徽,福建,江西,广东,广西,海南,',
        timeout: 5000,
        json: true
    };
    try {
        return await request(options);
    } catch (e) {
        return Promise.reject(e);
    }
}
