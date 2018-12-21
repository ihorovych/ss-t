const rp = require('request-promise')
const cheerio = require('cheerio')

const regExpLink = new RegExp('^(http|https)://')

exports.parsePage = async (url, query) => {
  try {
    var body = await rp(url)
  } catch (err) {
    return false
  }
  
  const regExpQuery = new RegExp(`${query.join(' ')}`, 'gi')
  const matches = body.match(regExpQuery)

  const $ = cheerio.load(body)
  const allLinks = []
  $('a').each((i, tag) => allLinks.push($(tag).attr("href")))
  const links = allLinks.filter(link => {
    return regExpLink.exec(link)
  })

  return {
    hits: matches.length,
    url,
    links,
  }
}

