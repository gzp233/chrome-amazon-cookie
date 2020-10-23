// 国家域名
const domains = [
    'sellercentral.amazon.com',
    'sellercentral.amazon.ca',
    'sellercentral.amazon.com.mx',
    'sellercentral.amazon.co.uk',
    'sellercentral.amazon.de',
    'sellercentral.amazon.fr',
    'sellercentral.amazon.it',
    'sellercentral.amazon.es',
    'sellercentral.amazon.nl',
    'sellercentral.amazon.se',
    'sellercentral-japan.amazon.com',
]

const ue_furls = {
    'fls-eu.amazon.co.uk': 'UK',
    'fls-na.amazon.com': 'US',
    'fls-na.amazon.ca': 'CA',
    'fls-na.amazon.com.mx': 'MX',
    'fls-eu.amazon.de': 'DE',
    'fls-eu.amazon.fr': 'FR',
    'fls-eu.amazon.it': 'IT',
    'fls-eu.amazon.es': 'ES',
    'fls-eu.amazon.nl': 'NL',
    'fls-eu.amazon.com': 'SE',
    'fls-fe.amazon.co.jp': 'JP'
}

// 获取实际国家
function getCountry() {
    let re = /ue_furl[\s=]+'([-\w.]+)'/
    const scripts = window.document.getElementsByTagName("script")
    for (let script of scripts) {
        let matches = re.exec(script.innerHTML)
        if (matches && ue_furls.hasOwnProperty(matches[1])) {
            sendData(ue_furls[matches[1]])
        }
    }
}

//发送国家信息到 background 处理
function sendData(country) {
    chrome.runtime.sendMessage({country: country, url: document.URL}, async function (response) {
        // TODO 可以写点页面处理
    });
}

window.addEventListener("load", watchAmazon, false);

function watchAmazon() {
    if (domains.includes(window.location.host)) {
        console.log('亚马逊 cookie 记录工具运行中...')
        getCountry()
    }
}





