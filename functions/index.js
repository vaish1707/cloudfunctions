const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
admin.initializeApp();
const ImageKit = require('imagekit');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboy({ immediate: true }));

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_END_POINT,
});

app.get('/time', (req, res) => {
  res.send(`${Date.now()}`);
});

app.post('/transform', (req, res) => {
  let base64data = [];
  if (req.busboy) {
    req.busboy
      .on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File: ' + filename + ', mimetype: ' + mimetype);
        let buffer = '';
        file.setEncoding('base64');
        file
          .on('data', function (data) {
            buffer += data;
          })
          .on('end', function () {
            base64data.push(buffer);
          });
      })
      .on('finish', function () {
        console.log('data', base64data);
        imagekit.upload(
          {
            file: `data:image/png;base64,${base64data}`,
            fileName: 'affirmation-image' + Date.now() + '.jpg',
          },
          function (error, result) {
            if (error) {
              console.log('err', error.message);
              res.send(error);
            }
            console.log('success', result);
            res.send(result);
          }
        );
      });
  }
});

exports.app = functions.runWith({ timeoutSeconds: 120 }).https.onRequest(app);
