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
const controller = require('./controllers');

app.get('/time', (req, res) => {
  res.send(`${Date.now()}`);
});

app.post('/transform', controller.uploadToImageKit);

exports.app = functions.runWith({ timeoutSeconds: 120 }).https.onRequest(app);
