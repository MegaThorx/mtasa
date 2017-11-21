const https = require('https')
const crypto = require('crypto')
const fs = require('fs')
const config = require('./config.json')

let getCurrentHash = (callback) => {
  https.get('https://nightly.mtasa.com/?multitheftauto_linux_x64-1.5-rc-latest', (res) => {
    const md5sum = crypto.createHash('md5')

    res.on('data', (d) => {
      md5sum.update(d)
    })

    res.on('end', () => {
      callback(md5sum.digest('hex'))
    })
  })
}

let compareHashes = (hash) => {
  let lastHash = ''

  if (fs.existsSync('last-version.txt')) {
    lastHash = fs.readFileSync('last-version.txt').toString()
  }

  if (lastHash !== hash) {
    console.log('Trigger build!')
    fs.writeFileSync('last-version.txt', hash)
    https.request({
      hostname: 'registry.hub.docker.com',
      port: 443,
      path: '/u/megathorx/mtasa/trigger/' + config.trigger_token,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).write('{"build": true}').end()
  }
}

let loop = () => {
  setTimeout(loop, 1000 * 60 * 60 * 24)
  getCurrentHash(compareHashes)
}

loop()
