"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAll = exports.loadCollection = exports.videoFilter = void 0;
const del = require("del");
const loadCollection = function (colName, db) {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        });
    });
};
exports.loadCollection = loadCollection;
const videoFilter = function (req, file, cb) {
    //accept video files only
    if (!file.originalname.match(/\.(webm|mpg|mp2|mpeg|mpe|mpv|ogg|mp4|m4p|m4v|avi|wmv|mov|qt|flv|swf|avchd)$/)) {
        return cb(new Error('Only video files are permitted.'), false);
    }
    cb(null, true);
};
exports.videoFilter = videoFilter;
const clearAll = function (folderPath) {
    del.sync([`${folderPath}/**`, `!$[folderPath]`]);
};
exports.clearAll = clearAll;
//# sourceMappingURL=utils.js.map