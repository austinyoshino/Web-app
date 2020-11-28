"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Loki = require("lokijs");
const utils_1 = require("./utils");
//setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'videos';
const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: utils_1.videoFilter }); //multer config; applies video filetype filter to uploads
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });
//clears all data before start
utils_1.clearAll(UPLOAD_PATH);
//app
const app = express();
app.use(cors());
app.listen(3000, function () {
    console.log('listening on port 3000!');
});
//default route
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(`
    <h1>Video Upload Demo</h1>
    <ul>
        <li>GET /videos - lists all uploaded videos</li>
        <li>GET /videos/{id} - retrieves specific video by ID</li>
        <li>POST /videos/upload - uploads video</li>
        <li> DELETE /videos/{id} - deletes specific video at ID</li>
    </ul>
    `);
}));
//retrieves list of uploaded videos
app.get('/videos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        res.send(col.data);
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
//video upload route
app.post('/videos/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        const data = col.insert(req.file);
        db.saveDatabase();
        res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
// retrieves specific video by id
app.get('/videos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        const result = col.get(parseInt(req.params.id));
        if (!result) {
            res.sendStatus(404);
            return;
        }
        ;
        res.setHeader('Content-Type', result.mimetype);
        fs.createReadStream(path.join(UPLOAD_PATH, result.filename)).pipe(res);
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
//deletes specific video by id
app.delete('/videos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        const result = col.remove(parseInt(req.params.id));
        db.saveDatabase();
        res.send('Video #' `${req.params.id}`, 'deleted.');
        if (!result) {
            res.sendStatus(404);
            return;
        }
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
//# sourceMappingURL=index.js.map