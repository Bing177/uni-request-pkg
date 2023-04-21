/* 封装uni对象中的request */

const baseUrl = 'https://example.com/api' // 服务器域名

// 请求拦截器
function requestInterceptor(config) {
    // 发送请求前的处理逻辑，比如验证本地token
    const token = uni.getStorageSync('token')
    if (token) {
        config.header = {
            'Content-type': 'Application/json',//json数据格式
            'Authorization': token // 有token是添加的头信息
        }
    }
    uni.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 1000
    })
    return config
}
// 响应拦截器
function responseInterceptor(response) {
    // 对状态码处理
    if (response.statuscode === 200) {
        uni.showToast({ title: '加载成功', icon: 'none', duration: 1000 })
        return response.data
    } else {
        uni.showToast({ title: '数据获取失败', icon: 'error', duration: 1000 })
        return Promise.reject(response.errMsg)
    }
}

// 封装request()
function request(url, method = 'GET', timeout, header, data) {
    return new Promise((resolve, reject) => {
        // 发送request()之前，调用请求拦截器，对请求进行处理，再发送给服务器
        const req = requestInterceptor({
            url: baseUrl + url,
            method,
            timeout,
            header,
            data
        })
        uni.request({
            url: req.url,
            method: req.method,
            timeout: req.timeout,
            header: req.header,
            data: req.data,
            success: res => {
                try {
                    // 调用响应拦截器
                    const data = responseInterceptor(res)
                    resolve(data)
                } catch (error) {
                    reject(error)
                }
            },
            fail: err => {
                reject(err)
            }
        })
    })
}

// 默认暴露get()和post()方式
export default {
    get(url,timeout=3000, header={}, data) {
        return request(url, 'GET', timeout, header, data)
    },
    post(url,timeout=3000, header={}, data={}) {
        return request(url, 'POST', timeout, header, data)
    }
}
