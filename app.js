const express = require("express");
const aws = require("aws-sdk");
const multer = require("multer")
const multerS3 = require("multer-s3")
const bodyParser = require('body-parser');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const hri = require('human-readable-ids').hri;

const adapter = new FileSync('db.json')
const db = low(adapter)

const app = express();

const s3 = new aws.S3({
  apiVersion: "2019-02-03",
  credentials: {
    accessKeyId:"AKIAIWNB7UTYKB5BSFZQ",
    secretAccessKey: "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",
    region: "eu-central-1"
  }
});

db.defaults({
    transfers: [],
    last_id: 0,
}).write();

app.use(bodyParser.json());
const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'dtransfers-dev',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now() + "_" + file.originalname);
        }
    })
}).array('file', 1);

app.get('/test', (req, res) => {
    res.send(hri.random());
});
//open http://localhost:3000/ in browser to see upload form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/transfers', function (req, res) {
    console.log(req.query.public_id);
    var pId = req.query.public_id;

    var dbTransfer = db.get('transfers')
        .find({public_id: pId})
        .value();

    if(dbTransfer !== undefined) {
        res.json(dbTransfer);
    }
});

app.post('/api/upload', function (req, res) {
    // console.log("got upload request");
    upload(req, res, function (err, data) {
        if (err) {
            res.send("Something went wrong!");
            console.log(err);
        } else {
          var link = req.files[0].location;
          res.json(saveTransferToDb(link, req.body));
        }
    });
});

function saveTransferToDb(link, data) {
    var lastId = db.get('last_id').value();
    var transfer = {
        id: lastId,
        public_id: hri.random(),
        s3_path: link,
        from: data.from,
        message: data.description,
        upload_date: Date.now(),
        expiry_date: Date.now() + 1 * 24 * 60 * 60 * 1000  // define some expiry times
    };

    db.get('transfers')
        .push(transfer)
        .write();

    db.update('last_id', l => l + 1).write();

    return transfer;
}

app.listen(3001, () => {
    console.log('Example app listening on port 3001!');
});
