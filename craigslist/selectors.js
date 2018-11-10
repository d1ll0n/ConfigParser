const selectors = {
  'results': [
    {
      'name': 'range',
      'selector': '.range',
      'value': 'text'
    },
    {
      'name': 'totalcount',
      'selector': '.totalcount',
      'value': 'text'
    },
    {
      'name': 'results',
      'many': true,
      'selector': '.result-info',
      'value': [
        {
          'name': 'datetime',
          'selector': '.result-date',
          'value': 'attr|datetime'
        },
        {
          'selector': '.result-title',
          'value': [
            {
              'name': 'title',
              'value': 'text'
            },
            {
              'name': 'url',
              'value': 'attr|href'
            }
          ]
        },
        {
          'name': 'location',
          'selector': '.result-hood',
          'value': 'text'
        },
        {
          'name': 'price',
          'selector': '.result-price',
          'value': 'text'
        },
        {
          'name': 'hasmap',
          'selector': '.maptag',
          'value': 'exists'
        },
        {
          'name': 'tags',
          'selector': '.result-tags',
          'value': 'exists'
        }
      ]
    }
  ],
  'details': [
    {
      'name': 'body',
      'selector': '#postingbody',
      'value': 'text'
    },
    {
      'name': 'replyPhoneIcon',
      'selector': '.phone',
      'value': 'exists'
    },
    {
      'name': 'title',
      'selector': '#titletextonly',
      'value': 'text'
    },
    {
      'name': 'date',
      'selector': '#display-date > .date',
      'value': 'attr|datetime'
    },
    {
      'name': 'googleMap',
      'selector': '.mapaddress a',
      'value': 'attr|href'
    },
    {
      'name': 'thumbnails',
      'many': true,
      'selector': '#thumbs img',
      'value': 'attr|src'
    },
    {
      'name': 'images',
      'many': true,
      'selector': '#thumbs .thumb',
      'value': 'attr|href'
    },
    {
      'name': 'price',
      'selector': '.price',
      'value': 'text'
    }
  ]
}
module.exports = selectors
