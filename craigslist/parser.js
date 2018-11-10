const selectors = require('./selectors')
const Parser = require('../index')
const resultsSelector = selectors.results
const detailsSelector = selectors.details

module.exports = class CraigslistParser {
  constructor () {
    this.parser = new Parser()
  }

  load (html) {
    this.parser.load(html)
  }

  findResults () {
    return this.parser.parseMany(this.parser.body, resultsSelector)
  }

  findDetails () {
    return this.parser.parseMany(this.parser.body, detailsSelector)
  }
}
