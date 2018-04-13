#!/usr/bin/env node
'use strict'

const modifyFiles = require('./utils').modifyFiles
const packageJson = require('../package.json')
const config = packageJson.config

modifyFiles(['./package.json', './template.yaml', './env.json'], [{
    regexp: new RegExp(config.s3BucketName, 'g'),
    replacement: 'YOUR_UNIQUE_BUCKET_NAME'
}, {
    regexp: new RegExp(config.region, 'g'),
    replacement: 'YOUR_AWS_REGION'
}])
