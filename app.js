const express = require("express");
const bodyParser = require('body-parser');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const hri = require('human-readable-ids').hri;
const s3 = require('./s3');
const crypto = require('crypto');
const path = require('path');


const adapter = new FileSync('db.json')
const db = low(adapter)

const app = express();
app.use(bodyParser.json());

db.defaults({
	transfers: [],
	last_id: 0,
}).write();


//todo: move this to env vars;
const s3Config = {
	accessKey: 'AKIAIWNB7UTYKB5BSFZQ',
	secretKey: '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',
	bucket: 'dtransfers-dev',
	region: 'eu-central-1',
	maxSize: 1024 * 1024 * 1
}

function saveTransferToDb(data) {
	let transfer = {
		key: data.key,
		public_id: hri.random(),
		s3_path: null, //comes from S3;
		from: data.from,
		message: data.description,
		upload_date: Date.now(),
		expiry_date: Date.now() + 1 * 24 * 60 * 60 * 1000  // define some expiry times
	};
	
	db.get('transfers')
		.push(transfer)
		.write();
	
	return transfer;
}

app.get('/api/transfer', function (req, res) {
	console.log(req.query.public_id);
	let pId = req.query.public_id;
	
	let dbTransfer = db.get('transfers')
		.find({public_id: pId})
		.value();
	
	if (dbTransfer) {
		res.json(dbTransfer);
	} else {
		res.status(404).json({
			code: 'TRANSFER_NOT_FOUND',
			message: "The transfer couldn't be found"
		});
	}
});

app.patch('/api/transfer', function (req, res) {
	let transferKey = req.query.key;
	let s3Path = req.query.s3path;
	
	let dbTransfer = db.get('transfers')
		.find({key: transferKey})
		.assign({s3_path: s3Path})
		.write();
	
	if(dbTransfer) {
		res.status(200).json(dbTransfer);
	} else {
		res.status(400).json({
			code: 'TRANSFER_NOT_FOUND',
			message: "Couldn't find the specified transfer"
		});
	}
});

app.post('/api/transfer', function (req, res) {
	console.log("GET: /api/upload2: " + JSON.stringify(req.query));
	if (req.query.filename) {
		let filename = crypto.randomBytes(16).toString('hex') + path.extname(req.query.filename);
		res.json(s3.s3Credentials(s3Config, {
			filename: filename,
			contentType: req.query.content_type,
		}));
		
		let data = req.body;
		data.key = filename;
		
		saveTransferToDb(data);
		
	} else {
		res.status(400).json({
			code: 'FILENAME_REQUIRED',
			message: 'filename is required'
		});
	}
});

app.listen(3001, () => {
	console.log('Server started on port 3001!');
});
