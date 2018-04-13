'use strict'

const fs = require('fs');
const im = require('imagemagick');
const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const imageDir = './AWS-Karuta/Reader/ja/img/';

const resize = image => {
  return new Promise((resolve, reject) => {
    im.resize({
      srcData: image,
      format: 'png',
      width: 128,
      height: 128
    }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

exports.handler = (event, context) => {
  const bucketName = process.env.BucketName;

  fs.readdirSync(imageDir).map(async fileName => {
    const emoji = await resize(fs.readFileSync(`${imageDir}/${fileName}`));

    await s3.putObject({
        Bucket: bucketName,
        Key: `emoji/aws_${fileName.toLowerCase()}`,
        Body: new Buffer(emoji, 'binary')
    }).promise();
  });
}
