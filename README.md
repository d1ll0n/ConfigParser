###ConfigScraper

This class makes most basic web scraping as easy as filling out a json file and loading html. It just adds three functions for cheerio scraping: getValue, parseOne and parseMany, which take care of some basic cheerio functions that get really repetitive in web scrapers. parseOne and parseMany do not refer to the number of outputs, but to the number of selectors being used.

### getValue(element, value)
**Finds the given value of an element**
Supported value properties are:
'text' - returns the text value of the element, with double spaces, tabs and trailing/leading whitespace removed
'exists' - returns a bool saying if the element exists
'attr|attributeToGet' - returns the result of element.attr(attributeToGet)
'is|isWhat' - returns the result of element.is(isWhat)
[selector1, selector2] - returns the result of parseMany(element, [selector1, selector2])

More value properties can easily be added by extending parser.getValue

### parseOne(parent, selector)
**Finds an element using parent.find(selector.selector) and returns an object with the property selector.name set to the result of getValue(element, selector.value)**

By default, parseOne only gets the first element found with selector.selector.

```javascript
var selector = {
	name: 'title', // property of return object will be title
	many: false // only get first element
	selector: '.result-title', // find class result-title
	value: 'text' // value of title will be titleElement.text()
}
var html = `
<body>
	<span class='result-title'>title1</span>
	<div class='result-title'>coolest title</div>
</body>
`
var body = cheerio.load(html).find('body')
console.log(parser.parseOne(body, selector))
// yields
{
	title: 'title1'
}
```


By setting selector.many, we could alternatively get all the titles in the context. 
```javascript
var selector = {
	name: 'titles',
	many: true
	selector: '.result-title',
	value: 'text'
}
var html = `
<body>
	<span class='result-title'>title1</span>
	<div class='result-title'>coolest title</div>
</body>
`
var body = cheerio.load(html).find('body')
console.log(parser.parseOne(body, selector))
// yields
{
	titles: ['title1','coolest title']
}
```

### parseMany(element, selector)
**Takes a list of selectors and returns one object with properties defined by each selector.name**

parseMany takes a list of selectors and returns an object with property:value relations corresponding to the name and value of each selector
```javascript
var selectors = [
	{
		name: 'title',
		selector: '.result-title',
		value: 'text'
	},
	{
		name: 'url',
		selector: '.result-link',
		value: 'attr|href'
	},
	{
		name: 'author',
		selector: '.result-author',
		value: 'text'
	}
]
var html = 
`<body>
	<p class='result-title'> Cool element! </p>
	<a href='https://www.reddit.com' class='result-link'>reddit</a>
	<span class='result-author'>dillon</span>
</body>`
var body = cheerio.load(html).find('body')
console.log(parser.parseMany(body, selectors))
// yields 
{
	title: 'Cool element!',
	url: 'https://www.reddit.com',
	author: 'dillon'
}
```

If the value of a selector is an array of other selectors, the value of selector.name in the result object is the result of parseMany(element, selector.value)

```javascript
var selector = {
	name: 'results',
	selector: '.result-info',
	many: true,
	value: [
		{
			name: 'title',
			selector: '.result-title',
			value: 'text'
		},
		{
			name: 'url',
			selector: '.result-link',
			value: 'attr|href'
		},
		{
			name: 'author',
			selector: 'result-author',
			value: 'text'
		},
		{
			name: 'hasPic',
			selector: 'img',
			value: 'exists'
		}
	]
}
var html = 
`<body>
	<div class='result-info'>
		<p class='result-title'> Google title </p>
		<a href='https://www.google.com' class='result-link'>google</a>
		<span class='result-author'>Campbell's chicken noodle soup</span>
		<img src='https://image-exists.com/yep.jpg'/>
	</div>
	
	<div class='result-info'>
		<p class='result-title'> Facebook title </p>
		<a href='https://www.facebook.com' class='result-link'>facebook</a>
		<span class='result-author'>Barack Obama</span>
	</div>
</body>`
var body = cheerio.load(html).find('body')
console.log(parser.parseOne(body, selector))
// yields
{
	results: [
		{
			title: 'Google title',
			url: 'https://www.google.com',
			author: 'Campbell\'s chicken noodle soup',
			hasPic: true
		},
		{
			title: 'Facebook title',
			url: 'https://www.facebook.com',
			author: 'Barack Obama'
			hasPic: false
		}
	]
}
```

If you want to get multiple values from one element without having several different selector objects finding the same element, you can omit the 'name' property of the root selector object and provide an array of selector objects as the value. These then get mapped on to the root object
```javascript
var selectors = [
	{
		selector: '.result-title',
		value: [
			{
				name: 'title',
				value: 'text'
			},
			{
				name: 'url',
				value: 'attr|href'
			}
		]
	},
	{
		selector: '.result-date',
		value: [
			{
				name: 'datetime',
				value: 'attr|datetime'
			},
			{
				name: 'timeago',
				value: 'text'
			}
		]
	}
]
var html = `
<body>
	<a class='result-title' href='https://www.google.com'>google</a>
	<span class='result-date' datetime='Oct 12. 1984'>5 hrs ago</span>
</body>
`
var body = cheerio.load(html).find('body')
console.log(parser.parseMany(body, selectors))
// yields
{
	title: 'google',
	url: 'https://www.google.com',
	datetime: 'Oct 12. 1984',
	timeago: '5 hrs ago'
}
```

### In closing
**parseMany** - arrays of selectors
**parseOne** - one selector
**selector** - must have name, selector and value properties. many is false by default, but if it is set to true the result will contain the specified values of every element found in the selector's context
**context** - begins with document body and becomes element found by selector for child selectors

I included a craigslist scraper which implements configparser as an example of how to use it