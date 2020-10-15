const ImageKit = require('imagekit');
const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_END_POINT,
});

export function time(req, res) {
  res.send(`${Date.now()}`);
}

export async function addMessage(req, res) {
  const original = req.query.text;
  const writeResult = await admin.firestore().collection('messages').add({ original: original });
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
}

export function uploadToImageKit(req, res) {
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
}

export function uploadImageUrl(req, res) {
  let base64data = req.body.base64;
  imagekit.upload(
    {
      file: `data:image/png;base64,${base64data}`,
      fileName: 'threedselfiy-image' + Date.now() + '.jpg',
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
}
