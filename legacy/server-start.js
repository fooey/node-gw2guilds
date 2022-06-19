import express from 'express';

import libData from 'lib/data';
import routes from 'routes';
import serverConfig from 'config/server';


const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
const serverPort = process.env.PORT ? process.env.PORT : 3000;



libData.init().then(() => {
    const app = express();

    serverConfig(app, express);
    routes(app, express);


    app.listen(serverPort, () => {
        console.log('');
        console.log('**************************************************');
        console.log('Express server started');
        console.log('Time:     %d', Date.now());
        console.log('Port:     %d', serverPort);
        console.log('Mode:     %s', nodeEnv);
        console.log('PID:      %s', process.pid);
        console.log('Platform: %s', process.platform);
        console.log('Arch:     %s', process.arch);
        console.log('Node:     %s', process.versions.node);
        console.log('V8:       %s', process.versions.v8);
        console.log('cwd:      %s', process.cwd());
        console.log('dir:      %s', __dirname);
        // console.log('Env:      %s', JSON.stringify(process.env));
        console.log('**************************************************');
        console.log('');
    });
});
