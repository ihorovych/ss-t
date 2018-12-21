const fs = require('fs')

const txtFile = 'result.txt'

exports.appendIntoTxt = (string) => {
  if (typeof string === 'string') return fs.appendFileSync(txtFile, string+'\n', 'utf8')
  if (Array.isArray(string)) return fs.appendFileSync(txtFile, string.join('\n'), 'utf8')
  throw new Error('Wrong data type')
}
