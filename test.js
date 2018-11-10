const CraigslistClient = require('./craigslist/client')
const fs = require('fs')
async function test(){
  let client = new CraigslistClient()
  let opts = { city: 'chicago', category: 'fgs', titlesOnly: true }
  let results = await client.search(opts)
  fs.writeFileSync('test-cl.json', JSON.stringify(results, null, 4))
}
test()