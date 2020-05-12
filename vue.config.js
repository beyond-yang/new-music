const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const axios = require('axios')
const bodyParser = require('body-parser')

module.exports = {
  devServer: {
    before(app) {
      // 轮播图数据
      app.get('/api/getTopBanner', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        const jumpPrefix = 'https://y.qq.com/n/yqq/album/'
        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          response = response.data
          if (response.focus.data && response.focus.data.content) {
            let slider = []
            let content = response.focus.data.content
            for (var i = 0; i < content.length; i++) {
              let contentItem = content[i]
              let sliderItem = {}
              sliderItem.id = contentItem.id
              sliderItem.linkUrl = jumpPrefix + contentItem.jump_info.url + '.html'
              sliderItem.picUrl = contentItem.pic_info.url
              slider.push(sliderItem)
            }
            res.json({
              code: 0,
              msg: 'suc',
              data: slider
            })
          } else {
            res.json({
              code: 1,
              msg: 'fail',
              data: null
            })
          }
        }).catch((e) => {
          console.log(e)
        })
      })
      // 歌单列表数据
      app.get('/api/getSongRecList', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      // 歌词数据
      app.get('/api/getLyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response)=>{
          let ret = response.data
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/
            const matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((e)=>{
          console.log(e)
        })
      })
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("common", resolve('src/common'))
      .set("components", resolve('src/components'))
      .set("base", resolve('src/base'))
      .set("api", resolve('src/api'))
  }
}