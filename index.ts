import * as express from 'express';
import * as multer from 'multer';
import * as cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import * as Loki from 'lokijs';
import { videoFilter, loadCollection, clearAll } from './utils';

//setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'videos';
const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: videoFilter}); //multer config; applies video filetype filter to uploads
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, {persistenceMethod: 'fs'});
//clears all data before start
clearAll(UPLOAD_PATH);

//app
const app = express();
app.use(cors());

app.listen(3000, function () {
    console.log('listening on port 3000!');
});

//default route
app.get('/', async (req, res) =>{
    res.send(`
    <h1>Video Upload Demo</h1>
    <ul>
        <li>GET /videos - lists all uploaded videos</li>
        <li>GET /videos/{id} - retrieves specific video by ID</li>
        <li>POST /videos/upload - uploads video</li>
        <li> DELETE /videos/{id} - deletes specific video at ID</li>
    </ul>
    `);
});

//retrieves list of uploaded videos
app.get('/videos', async (req, res) => {
    try {
        const col = await loadCollection(COLLECTION_NAME, db);
        res.send(col.data);
    } catch (err) {
        res.sendStatus(400);
    }
})

//video upload route
app.post('/videos/upload', upload.single('file'), async (req, res) => {
    try {
        const col = await loadCollection(COLLECTION_NAME, db);
        const data = col.insert(req.file);

        db.saveDatabase();
        res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
    } catch(err) {
        res.sendStatus(400);
    }
})

// retrieves specific video by id
app.get('/videos/:id', async (req, res) => {
    try {
        const col = await loadCollection(COLLECTION_NAME, db);
        const result = col.get(parseInt(req.params.id));

        if(!result) {
            res.sendStatus(404);
            return;
        };

        res.setHeader('Content-Type', result.mimetype);
        fs.createReadStream(path.join(UPLOAD_PATH, result.filename)).pipe(res);
    } catch (err) {
        res.sendStatus(400);
    }
})