const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

let drive;
authorize()

function authorize() {

  const credentials = require('./cert.json');
  const auth = new google.auth.JWT(
    credentials.client_email, null, credentials.private_key, SCOPES
  )
  __init__(auth)
  // listFiles(auth)
  // uploadFile(auth)
}

function __init__(auth) {
  drive = google.drive({ version: 'v3', auth });
}

function listFiles(auth) {
  const drive = google.drive({ version: 'v3', auth });
  // GET LIST FILE WITH FILTER
  // drive.files.list({
  //   q: "'1WJzLOSuYm3m87sUHuhgbS3jadiBAeC1F' in parents and name='00000002.json'",
  //   pageSize: 10,
  //   fields: 'nextPageToken, files(id, name)',
  // }, (err, res) => {
  //   if (err) return console.log('The API returned an error: ' + err);

  //   const files = res.data.files;

  //   if (files.length) {
  //     console.log('Initial Files:');
  //     files.map((file) => {
  //       console.log(`${file.name} (${file.id})`);
  //     });
  //   } else {
  //     console.log('No files found.');
  //   }

  // });

  
  // SOME ACTION
  // downloadJson(auth)
  // uploadFile(auth)
  getFile(drive)
}

function downloadJson(auth) {
  const drive = google.drive({ version: 'v3', auth });

  var fileId = '1S9RFVYsAxOlzr39pOWQzdiJNyi2rjVWK';
  // var dest = fs.createWriteStream('./photo.jpg');
  const result = drive.files.get({
    fileId: fileId,
    alt: 'media'
  }).then(res => {

    console.log(res.data)
  }).catch(err => {
    console.log(err.message)
  })
}

function uploadFile(auth) {
  const drive = google.drive({ version: 'v3', auth });

  // drive.files.list({
  //   q: "name='00000001-test.json'",
  //   fields: "files(id, name)",
  //   spaces: "drive",
  // }).then(async res => {
  //   console.log('IN UPLOAD FILE', res.data.files)
  //   if (!res.data.files.length) {
  //     // const drive = google.drive({version: "v3", auth});
  //     _createData(drive)
  //   } else {
  //     const files = res.data.files
  //     for(const i in files) {

  //       await drive.files.delete({fileId: files[i].id})
  //     }
  //     await drive.files.emptyTrash()
  //     _createData(drive)
  //   }
  // }).catch(err => console.log(err.message))
  _createData(drive)

}

function _createData(drive) {
  var fileMetadata = {
    'name': '00000002.json',
    parents: ['1WJzLOSuYm3m87sUHuhgbS3jadiBAeC1F']
  };
  var media = {
    mimeType: 'application/json',
    body: fs.createReadStream('00000002.json')
  };
  drive.files.create({
    resource: fileMetadata,
    media,
  }).then((res) => {
    console.log(res.data.id)
  }).catch(err => {
    console.log(err)
  })
}

function getFile(drive) {
  const fileId='18JNjAjXJhbpTTEqPi_xWmB5yI0tpC2p-';
  drive.files.get({
    fileId,
  })
  .then(res => console.log(res.data))
  .catch(err => console.log(err.message))
}

const express = require('express')
const app = express()
const PORT = 5000;

app.get('/', (req, res) => {
  return res
  .set('Content-Type', 'application/json')
  .send({
    message: "Welcome to Google Drive Service!"
  })
})

app.get('/lists', async (req, res) => {
  try {
    const result = await drive.files.list({
      q: "'tm_dragon_qc' in parents",
      pageSize: 5,
      fields: 'files(id, name)',
    })
    return res.send(result.data.files)
  } catch (err) {
    return res.send({message: err.message})
  }
})

app.listen(PORT, () => console.log('Application start at port 5000'))