const AWS = require('aws-sdk');
let uuid = require('uuid');
var common = {}
common.uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (file) {
      let s3bucket = new AWS.S3({
        accessKeyId: process.env.AWSAccessKey,
        secretAccessKey: process.env.AWSSecretKey,
        Bucket: 's3-cnpm',
      });


      s3bucket.createBucket(function () {
        let params = {
          Key: uuid.v4(),
          Body: file.data,
          ContentType: file.mimetype,
          Bucket: 's3-cnpm',
          ACL: 'public-read'
        };
        s3bucket.upload(params, function (err, data) {
          if (err) {
            return reject({ e: 1, m: err.message });
          }
          else {
            resolve({
              e: 0,
              data: data,
            })
          }
        });
      });
    } else {
      return reject({ e: 1 });
    }
  })
}
module.exports = common;