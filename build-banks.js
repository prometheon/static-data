const fetch = require('node-fetch')
const jsdom = require('jsdom')
const { writeFileSync } = require('fs')

process.stdout.write('• Downloading banks from Wikipedia... ')
const downloadingBanks = fetch('https://en.wikipedia.org/wiki/List_of_largest_banks_in_the_United_States')
  .then((r) => r.text())
  .then((html) => {
    const { JSDOM } = jsdom
    const dom = new JSDOM(html)
    const table = dom.window.document.querySelector('table tbody')
    const names1 = Array.from(table.querySelectorAll('td:nth-child(2)')).map((el) => el.textContent.trim())
    const names2 = Array.from(table.querySelectorAll('td:nth-child(2) > a:first-child')).map((el) => el.href)
    const bankNames = names2.map((n, i) => {
      if (n.includes('redlink=1')) {
        return names1[i]
      } else {
        const name = decodeURIComponent(
          n
            .match(/\/([^\/]+)$/)?.[1]
            ?.replace('_(United_States)', '')
            ?.replaceAll('_', ' ')
        )
        const addedName = names1[i].includes(name) || name.includes(names1[i]) ? '' : ` (${names1[i]})`
        return `${name}${addedName}`
      }
    })
    return bankNames
  })

Promise.all([downloadingBanks]).then((values) => {
  const banks = values[0]
  writeFileSync('./banks/index.json', JSON.stringify(banks))
  process.stdout.write('Done.\n')
})
