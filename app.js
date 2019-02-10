const express = require("express");
const aws = require("aws-sdk");
const multer = require("multer")
const multerS3 = require("multer-s3")
const bodyParser = require('body-parser');

const app = express();

const s3 = new aws.S3({
  apiVersion: "2019-02-03",
  credentials: {
    accessKeyId:"AKIAIWNB7UTYKB5BSFZQ",
    secretAccessKey: "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",
    region: "eu-central-1"
  }
});

app.use(bodyParser.json());
const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'dtransfers-dev',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now() + "_" + file.originalname); //use Date.now() for unique file keys
        }
    })
}).array('file', 1);

//open http://localhost:3000/ in browser to see upload form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/upload', function (req, res) {
    // console.log("got upload request");
    upload(req, res, function (err, data) {
        if (err) {
            res.send("Something went wrong!");
            console.log(err);
        } else {
          var link = req.files[0].location;

          res.json({link: link});
          // res.send("Download link: <a href='" + link + "'>"+ link +"</a>");
        }
    });
});

app.listen(3001, () => {
    console.log('Example app listening on port 3001!');
});
