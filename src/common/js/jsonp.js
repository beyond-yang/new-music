// 封装jsonp请求
import originJSONP from 'jsonp'

function jsonp(url, data, options) {
  url+= (url.indexOf('?')<0?'?':'&')+params(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 此函数把对象转化为字符串参数
function params(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}