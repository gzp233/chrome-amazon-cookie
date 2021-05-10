// 记录当前脚本的运行日期，对应的 cookie 记录和报错 更新间隔 单位分钟
const state = {
    date: null,
    recorder: {},
    interval: 10,
    error: false
}

function getNowDate() {
    const now = new Date()
    return now.toLocaleDateString().replace(/\//g, '-')
}

function notifySuccess(country) {
    state.recorder[country] = getNowTime()
}

function notifyError() {
    if (!state.error) {
        state.error = true
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'icon.png',
            title: '亚马逊 cookie 记录工具',
            message: '服务端挂了，请通知 IT 处理',
        });
    }
}

function sendData(request) {
    const params = {
        cookie: headers.cookie,
        referer: headers.referer,
        origin: headers.origin,
        country: request.country,
        authority: request.authority,
        domain:  "https://" + request.domain
    }
    $.ajax({
        type: "POST",
        url: "http://ads.laborsing.com/api/cookie",
        data: params,
        success: function () {
            notifySuccess(request.country)
        },
        error() {
            notifyError()
        }
    });
    return '更新' + request.country + '成功...'
}

function runnable(country) {
    const now = getNowDate()
    if (state.date !== now) {
        state.recorder = {}
        state.error = false
        state.date = now
        return true
    }

    return !state.recorder[country] || getNowTime() - state.recorder[country] > state.interval * 60 * 1000;
}

function getNowTime() {
    const now = new Date()
    return now.getTime()
}


const headers = {
    origin: '',
    referer: '',
    cookie: ''
}

// 请求头获取一下亚马逊的 headers
chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
        const requestHeaders = details.requestHeaders;
        if (details.url.indexOf('sellercentral.amazon') !== -1
            || details.url.indexOf('sellercentral-japan.amazon') !== -1) {
            for (let h of requestHeaders) {
                if (h.name.toLowerCase() === 'referer') headers.referer = h.value
                if (h.name.toLowerCase() === 'cookie') headers.cookie = h.value
                if (h.name.toLowerCase() === 'origin') headers.origin = h.value
            }
        }
        return {requestHeaders: details.requestHeaders};
    },
    {
        urls: ["https://*/*"]
    },
    ["blocking", "requestHeaders", "extraHeaders"]
);


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        let rsp = runnable(request.country) ? sendData(request) :
            request.country + '最近' + state.interval + '分钟已更新 cookie'
        setTimeout(function () {
            sendResponse(rsp)
        }, 2000)
        return true
    }
)