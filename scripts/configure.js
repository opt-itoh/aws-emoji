#!/usr/bin/env node
'use strict'

const fs = require('fs')
const exec = require('child_process').execSync
const modifyFiles = require('./utils').modifyFiles

let minimistHasBeenInstalled = false

if (!fs.existsSync('./node_modules/minimist')) {
    exec('npm install minimist --silent')
    minimistHasBeenInstalled = true
}

const args = require('minimist')(process.argv.slice(2), {
    string: [
        'bucket-name',
        'region',
    ],
    default: {
        region: 'us-east-1',
    }
})

if (minimistHasBeenInstalled) {
    exec('npm uninstall minimist --silent')
}

const bucketName = args['bucket-name']
const region = args.region
const availableRegions = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ca-central-1']

if (!bucketName) {
    console.error('You must supply a bucket name as --bucket-name="<bucketName>"')
    return
}

if (availableRegions.indexOf(region) === -1) {
    console.error(`Amazon API Gateway and Lambda are not available in the ${region} region. Available regions: us-east-1, us-west-2, eu-west-1, eu-central-1, ap-northeast-1, ap-northeast-2, ap-southeast-1, ap-southeast-2, ca-central-1`)
    return
}

modifyFiles(['./package.json', './template.yaml', './env.json'], [{
    regexp: /YOUR_UNIQUE_BUCKET_NAME/g,
    replacement: bucketName
}, {
    regexp: /YOUR_AWS_REGION/g,
    replacement: region
}])
