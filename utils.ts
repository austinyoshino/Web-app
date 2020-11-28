import * as del from 'del';
import * as Loki from 'lokijs';

const loadCollection = function (colName, db: Loki): Promise<Collection<any>> {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        })
    });
}

const videoFilter = function (req, file, cb) {
    //accept video files only
    if (!file.originalname.match(/\.(webm|mpg|mp2|mpeg|mpe|mpv|ogg|mp4|m4p|m4v|avi|wmv|mov|qt|flv|swf|avchd)$/)) {
        return cb (new Error('Only video files are permitted.'), false)
    }
    cb(null,true);
};

export { videoFilter, loadCollection }