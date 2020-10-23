// 记录当前脚本的运行日期，对应的 cookie 记录和报错
const state = {
    date: null,
    counter:{},
    error:false
}

function getNowDate() {
    const now = new Date()
    return now.toLocaleDateString().replace(/\//g, '-')
}

function notifySuccess(country) {
    state.date = getNowDate()
    state.counter[country] = true
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

function sendData(cookie, country) {
    $.ajax({
        type: "POST",
        url: "http://aaa.bbb.com/api/cookie",
        data: {country: country, cookie: cookie},
        success: function () {
            notifySuccess(country)
        },
        error() {
            notifyError()
        }
    });
}

function runnable(country) {
    const now = getNowDate()
    if (state.date !== now) {
        state.counter = {}
        state.error = false
        state.date = now
        return true
    }

    return !(state.date === now && state.counter[country]);
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        let country = request.country
        chrome.cookies.getAll({
            url: request.url
        }, (cks) => {
            let cookie = cks.map(item => {
                return item.name + '=' + item.value
            }).join(';')
            runnable(country) ? sendData(cookie, country) : console.log(country + '当日已更新 cookie')
        })
    }
)
