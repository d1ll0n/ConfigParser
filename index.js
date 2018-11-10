const cheerio = require('cheerio')

const regexSpace = /(\s\s)?(\t)?/g

module.exports = class Parser {
  load (html) {
    const $ = cheerio.load(html)
    this.$ = $
    this.body = $('body')
  }

  getValue (element, value) {
    // Check if we want to see if element exists
    if (value === 'exists') {
      return !!element
    }
    // Otherwise return null if element not found
    if (!element) return null
    // If value is an array then we are getting child elements
    if (Array.isArray(value)) {
      return this.parseMany(element, value)
    }
    if (value.indexOf('attr|') !== -1) {
      let attr = value.replace('attr|', '')
      var att = element.attr(attr)
      return att ? att.trim() : null
    }
    if (value.indexOf('is|') !== -1) {
      let check = value.replace('is|', '')
      return element.is(check)
    }
    if (value === 'text') {
      var text = element.text()
      return text ? text.replace(regexSpace, '').trim() : null
    }
    return null
  }

  parseOne (parent, selector) {
    let elements
    if(selector.selector) elements = parent.find(selector.selector)
    // if no selector given, must not be many
    else if (selector.many) throw new Error('Selector obj without "selector" property is only for getting attributes off the root node and can not have many')

    if (!selector.many) {      
      // if no selector, use parent for search 
      if (!selector.selector) return this.getValue(parent, selector.value)
      return this.getValue(elements.first(), selector.value)
    }
    else {
      let loaded = []
      let $ = this.$
      elements.each(function (i, elem) {
        loaded.push($(this))
      })
      let outputs = loaded.map(l => this.getValue(l, selector.value))
      return outputs
    }
  }

  parseMany (parent, selectors) {
    const output = {}
    for (let selector of selectors) {
      if(!selector.name){
        if(!Array.isArray(selector.value)) throw new Error('Selector obj without "name" property is only valid when value property is an array of selector objects')
        // If no name is given, map props of children to output object
        const val = this.parseOne(parent, selector)
        for(var property in val) output[property] = val[property]
      }
      else output[selector.name] = this.parseOne(parent, selector)
    }
    return output
  }
}
