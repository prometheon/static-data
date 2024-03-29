const { execSync } = require('child_process')
const { writeFileSync, existsSync } = require('fs')
const CSV = require('csv-string')
const mkdirp = require('mkdirp')
const fetch = require('node-fetch')
const additions = require('./cars/additions.json')
const logos = require('./node_modules/@avto-dev/vehicle-logotypes/src/vehicle-logotypes.json')

process.stdout.write('• Updating car database... ')
process.stdout.write('Updating logos... ')
mkdirp.sync('./cars/logos')
const promises = []
Object.keys(logos).forEach((l) => {
  const logo = logos[l]
  promises.push(
    fetch(decodeURI(logo.logotype.uri))
      .then((r) => r.buffer())
      .then((img) => {
        const ext = logos[l].logotype.mime.split('/')[1]
        const file = `${l}.${ext}`
        writeFileSync(`./cars/logos/${file}`, img)
      })
  )
})

Promise.all(promises)
  .then(() => {
    process.stdout.write('Updating json... ')
    const csv = execSync('cd ./node_modules/us-car-models-data && tail -n +2 -q *.csv').toString('UTF-8').trim()

    const records = CSV.parse(csv)
    const cars = {}
    records.forEach((r) => {
      const [year, make, model, typeRaw] = r
      const years = Array.from(new Set([...(cars[make]?.[model]?.years || []), Number.parseInt(year)]))
      const type = JSON.parse(typeRaw)
      if (!cars[make]) {
        cars[make] = {}
      }
      cars[make][model] = { type, years }
      const logoName = `${make.toLowerCase().replace(' ', '-')}.png`
      const logo = existsSync(`./cars/logos/${logoName}`) ? logoName : undefined
      if (logo) {
        cars[make][model].logo = logo
      }
    })

    Object.keys(additions).forEach((make) => {
      Object.keys(additions[make]).forEach((model) => {
        if (!cars[make]) {
          cars[make] = {}
        }
        cars[make][model] = additions[make][model]
        const logoName = `${make.toLowerCase().replace(' ', '-')}.png`
        const logo = additions[make][model].logo || (existsSync(`./cars/logos/${logoName}`) ? logoName : undefined)
        if (logo) {
          cars[make][model].logo = logo
        }
      })
    })

    writeFileSync('./cars/index.json', JSON.stringify(cars))
  })
  .then(() => {
    process.stdout.write('Done.\n')
  })
