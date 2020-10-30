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
    'fls-eu.amazon.se': 'SE',
    'fls-fe.amazon.co.jp': 'JP'
}

function getCountry() {
    const scripts = window.document.getElementsByTagName("script")
    let authority = ''
    let feUrl = ''
    for (let script of scripts) {
        let matches = /ue_sn[\s=]+'([-\w.]+)'/.exec(script.innerHTML)
        if (matches && matches[1]) {
            authority = matches[1]
        }

        let matches2 = /ue_furl[\s=]+'([-\w.]+)'/.exec(script.innerHTML)
        if (matches2 && ue_furls.hasOwnProperty(matches2[1])) {
            feUrl = matches2[1]
        }
        if (authority && feUrl) {
            sendData(authority, feUrl)
            break
        }
    }

}

//发送国家信息到 background 处理
function sendData(authority, feUrl) {
    const params = {
        authority: authority,
        country: ue_furls[feUrl],
        domain: window.location.host
    }
    chrome.runtime.sendMessage(params, async function (response) {
        console.log(response)
    });
}

window.addEventListener("load", watchAmazon, false);

function watchAmazon() {
    if (domains.includes(window.location.host)) {
        console.log('亚马逊 cookie 记录工具运行中...')
        getCountry()
    }
}