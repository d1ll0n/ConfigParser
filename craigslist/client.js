const replace1to100 = require('./numberToEnglish').replace1to100
const CraigslistParser = require('./parser')

const request = require('request-promise')

const regexPhone = /1?-?(\.)?(\()?\d{3}(-)?(\))?(\.)?(\s)?\d{3}(-)?(\.)?(\s)?\d{4}/g
const regexSpace = /(\s\s)?(\t)?/g

module.exports = class CraigslistClient {
  constructor (proxy) {
    this.proxy = proxy
    this.request = request.defaults({
      proxy: proxy ? getProxyString(proxy) : null,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'
      }
    })
  }

  async testProxy () {
    let body = await this.request.get('http://www.whatsmyip.com')
    return body.indexOf(this.proxy.host) !== -1
  }

  async getParser (url) {
    let html = await request.get(url)
    let parser = new CraigslistParser()
    parser.load(html)
    return parser
  }

  // options = {city, category}
  async search (options) {
    let url = optionsUrl(options)
    let parser = await this.getParser(url)
    return parser.findResults()
  }

  async details (url) {
    let parser = await this.getParser(url)
    let details = parser.findDetails()
    details.body = cleanString(replace1to100(details.body))
    details.phonesInDescription = details.body.match(regexPhone)
    return details
  }
}

function cleanString (s) {
  return s.replace(regexSpace, '').trim()
}

var getProxyString = proxy =>
  `http://${
    proxy.username && proxy.password
      ? `${proxy.username}:${proxy.password}@`
      : ''
  }${proxy.host}:${proxy.port}`

function optionsUrl (options) {
  return `https://${options.city}.craigslist.org/search/` +
  `${options.offset ? '&s=' + options.offset : ''}` +
  `${options.category}?${options.query ? '&query=' + options.query : ''}` +
  `${options.hasPic ? '&hasPic=1' : ''}` +
  `${options.postedToday ? '&postedToday=1' : ''}` +
  `${options.bundleDuplicates ? '&bundleDuplicates=1' : ''}` +
  `${options.searchNearby ? '&searchNearby=1' : ''}` +
  `${options.titlesOnly ? '&srchType=T' : ''}`
}

function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
