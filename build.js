const glob = require('glob')
const { spawn } = require('child_process')
const temp = require('temp')
const fs = require('fs')
const seq = require('promise-sequential')

temp.track()
glob('build-*.js', (err, matches) => {
  if (err) throw new Error(`Cannot glob folder: ${err}`)
  process.stdout.write('Building all files... \n')
  const promises = matches.map((file) => () => {
    return new Promise((resolve, reject) => {
      const s = spawn('node', [file])
      s.stdout.on('data', (out) => {
        process.stdout.write(out)
      })
      s.on('exit', () => {
        resolve()
      })
    })
  })
  seq(promises).then(() => {
    process.stdout.write('Done.\n')
  })
})
