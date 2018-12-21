const { appendIntoTxt } = require('./writer')
const { parsePage } = require('./parser')
const diff = require('lodash.differencewith')
const uniq = require('lodash.uniq')

const link = process.argv[2]
const maxDeep = process.argv[3]
const query = process.argv.slice(4,8)
if (+maxDeep === NaN || +maxDeep < 1) throw new Error('Wrong deep level')

let dublicatesLinks = []

const search = async (link, query, deep = 1) => {
  try {
    var result = await parsePage(link, query)
  } catch (err) {
    return false
  }
  if (!result) return false
  const { url, hits, links} = result

  appendIntoTxt(`${decodeURIComponent(url)} ${hits}`)

  const newLinks = diff(links, dublicatesLinks, (a, b) => a === b)
  const uniqLinks = uniq(newLinks)
  dublicatesLinks = [ ...dublicatesLinks, ...uniqLinks ]

  if (deep < maxDeep) {
    uniqLinks.forEach(link => {
      search(link, query, deep + 1)
    });
  }
}


search(link, query)