const https = require('https')
const crypto = require('crypto')
const fs = require('fs')
const config = require('./config.json')
const exec = require('child_process').execSync

const mtaVersions = {
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

const latestVersion = '1.5'

/*
docker build -t mtasa --build-arg DLURL=https://nightly.mtasa.com/multitheftauto_linux-1.5.5-rc-11748.tar.gz --build-arg ARCH=x86 .
*/

let getCurrentHash = (url, callback) => {
  https.get(url, (res) => {
    const md5sum = crypto.createHash('md5')

    res.on('data', (d) => {
      md5sum.update(d)
    })

    res.on('end', () => {
      callback(md5sum.digest('hex'))
    })
  })
}

let compareHashes = (version, arch, hash) => {
  let lastHash = {}

  if (fs.existsSync('versions.json')) {
    lastHash = JSON.parse(fs.readFileSync('versions.json').toString())
  }

  if (lastHash.length === 0 || !lastHash[version] || lastHash[version][arch] !== hash) {
    if (!lastHash[version]) {
      lastHash[version] = {}
    }
    lastHash[version][arch] = hash
    fs.writeFileSync('versions.json', JSON.stringify(lastHash))
    console.log('Trigger build!')
    buildVersion(version, arch)
  }
}

let buildVersion = (version, arch) => {
  let name = 'mtasa_' + version + '_' + arch
  exec('docker build -t ' + name + ' --build-arg DLURL=' + mtaVersions[version][arch] + ' --build-arg ARCH=' + arch + ' .')

  if (arch === 'x64' || !mtaVersions[version]['x64']) {
    exec('docker tag ' + name + ' megathorx/mtasa:' + version)
    if (version === latestVersion) {
      exec('docker tag ' + name + ' megathorx/mtasa:latest')
    }
  }

  exec('docker tag ' + name + ' megathorx/mtasa:' + version + '_' + arch)

  exec('docker push megathorx/mtasa')

  exec('docker rmi ' + name)

  exec('docker rmi -f $(docker images | grep "^megathorx/mtasa" | awk \'{print $3}\')')
  exec('docker rmi $(docker images | grep "^<none>" | awk \'{print $3}\')')
  console.log('build done')
}

let loop = () => {
  setTimeout(loop, 1000 * 60 * 60 * 8)
  for (let version in mtaVersions) {
    for (let arch in mtaVersions[version]) {
      getCurrentHash(mtaVersions[version][arch], (hash) => { compareHashes(version, arch, hash) })
    }
  }
}

loop()
