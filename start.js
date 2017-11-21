const https = require('https')
const crypto = require('crypto')
const fs = require('fs')
const config = require('./config.json')
const exec = require('child_process').execSync

const mta_versions = {
  '1.1': {
    'x86': 'https://nightly.mtasa.com/multitheftauto_linux-1.1.1-rc-3544-net1BE.tar.gz'
  },
  '1.2': {
    'x86': 'https://nightly.mtasa.com/multitheftauto_linux-1.2.0-rc-3735-net1CB.tar.gz'
  },
  '1.3': {
    'x86': 'https://nightly.mtasa.com/multitheftauto_linux-1.3.5-rc-6761-net1CE.tar.gz'
  },
  '1.4': {
    'x86': 'https://nightly.mtasa.com/multitheftauto_linux-1.4.1-rc-7382-net1D8.tar.gz',
    'x64': 'https://nightly.mtasa.com/multitheftauto_linux_x64-1.4.1-rc-7382-net1D8.tar.gz'
  },
  '1.5': {
    'x86': 'https://nightly.mtasa.com/?multitheftauto_linux-1.5-rc-latest',
    'x64': 'https://nightly.mtasa.com/?multitheftauto_linux_x64-1.5-rc-latest'
  }
}

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
    exec('curl -H "Content-Type: application/json" --data \'{"build": true}\' -X POST https://registry.hub.docker.com/u/megathorx/mtasa/trigger/' + config.trigger_token + '/')
  }
}

let loop = () => {
  setTimeout(loop, 1000 * 60 * 60 * 24)
  getCurrentHash(compareHashes)
}

loop()
