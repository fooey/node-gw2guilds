import path from 'path';
import fs from 'fs-extra';

import _ from 'lodash';
import request from 'request';


/*
*   module globals
*/

const localRoot = './bg';


let dlQueue = async.queue(function (task, cb) {
    console.log('download %s to %s', task.remotePath, task.localPath);
    downloadFile(task.remotePath, task.localPath, cb);
}, 8);


/*
*
*   MAIN
*
*/

request(
    'https://api.guildwars2.com/v2/emblem/backgrounds?ids=all',
    (err, response, body) => {
        const data = JSON.parse(body);

        _.each(data, (bg) => {
            _.each(bg.layers, (remotePath) => {
                const localPath = path.resolve(localRoot, `${bg.id}.png`);

                dlQueue.push({
                    remotePath,
                    localPath,
                });
            });
        });
    }
);



function downloadFile(remotePath, localPath, cb) {
    request(remotePath)
        .pipe(fs.createOutputStream(localPath))
        .on('finish', () => {
            console.log(`downloaded %s`, remotePath);
            cb();
        });

}
