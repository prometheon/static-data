const fetch = require('node-fetch')
const jsdom = require('jsdom')
const { writeFileSync } = require('fs')

process.stdout.write('Downloading banks from Wikipedia... ')
const downloadingBanks = fetch('https://en.wikipedia.org/wiki/List_of_largest_banks_in_the_United_States')
  .then((r) => r.text())
  .then((html) => {
    try {
      const { JSDOM } = jsdom
      const dom = new JSDOM(html)
      const banks = Array.from(
        dom.window.document.querySelector('table tbody').querySelectorAll('td:nth-child(2)')
      ).map((el) => el.textContent.trim())
      return banks
    } catch (err) {
      throw new Error(`Cannot parse banks: ${err}`)
    }
  })
  .catch(function (err) {
    throw new Error('Cannot download banks from Wikipedia.')
  })

Promise.all([downloadingBanks]).then((values) => {
  const banks = values[0]
  writeFileSync('./banks/index.json', JSON.stringify(banks))
  process.stdout.write('Done.\n')
})
