var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../diplomadobot-alejo8591.zip');
var kuduApi = 'https://diplomadobot-alejo8591.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$diplomadobot-alejo8591';
var password = 'XC5EcrivPP52ZSpazfR2F6F7TpxMpcpat6Jt13xE7m49kfJ6HwfgATSpBLYc';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('diplomadobot-alejo8591 publish');
  } else {
    console.error('failed to publish diplomadobot-alejo8591', err);
  }
});